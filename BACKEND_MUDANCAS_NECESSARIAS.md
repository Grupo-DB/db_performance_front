# Mudanças Necessárias no Backend Django

## 📋 Objetivo
Permitir que o mesmo ensaio/cálculo seja usado múltiplas vezes em uma ordem expressa (diferentes laboratórios), preservando duplicatas.

## 🔧 Mudanças nos Models

### 1. Atualizar `OrdemExpressa` para usar tabelas intermediárias

```python
# backend/models.py

class OrdemExpressa(models.Model):
    id = models.AutoField(primary_key=True)
    numero = models.CharField(max_length=255, null=False, blank=False)
    data = models.DateField(null=False, blank=False)
    
    # IMPORTANTE: Usar 'through' para especificar tabela intermediária
    ensaios = models.ManyToManyField(
        Ensaio, 
        through='OrdemExpressaEnsaio',  # <- Tabela intermediária
        blank=True, 
        related_name='expressa_ensaio'
    )
    
    calculos_ensaio = models.ManyToManyField(
        CalculoEnsaio,
        through='OrdemExpressaCalculo',  # <- Tabela intermediária
        blank=True,
        related_name='expressa_calculo'
    )
    
    responsavel = models.CharField(max_length=255, null=True, blank=True)
    digitador = models.CharField(max_length=355, null=True, blank=True)
    classificacao = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        verbose_name = 'Ordem Expressa'
        verbose_name_plural = 'Ordens Expressas'


class OrdemExpressaEnsaio(models.Model):
    """Tabela intermediária para permitir duplicatas de ensaios"""
    ordem_expressa = models.ForeignKey(OrdemExpressa, on_delete=models.CASCADE, related_name='ensaios_intermediarios')
    ensaio = models.ForeignKey(Ensaio, on_delete=models.CASCADE)
    laboratorio = models.CharField(max_length=10, null=True, blank=True)
    laboratorio_original = models.CharField(max_length=10, null=True, blank=True)
    somente_leitura = models.BooleanField(default=False)
    ordem = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['ordem']
        verbose_name = 'Ensaio da Ordem Expressa'
        verbose_name_plural = 'Ensaios da Ordem Expressa'


class OrdemExpressaCalculo(models.Model):
    """Tabela intermediária para permitir duplicatas de cálculos"""
    ordem_expressa = models.ForeignKey(OrdemExpressa, on_delete=models.CASCADE, related_name='calculos_intermediarios')
    calculo = models.ForeignKey(CalculoEnsaio, on_delete=models.CASCADE)
    laboratorio = models.CharField(max_length=10, null=True, blank=True)
    laboratorio_original = models.CharField(max_length=10, null=True, blank=True)
    somente_leitura = models.BooleanField(default=False)
    ordem = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['ordem']
        verbose_name = 'Cálculo da Ordem Expressa'
        verbose_name_plural = 'Cálculos da Ordem Expressa'
```

### 2. Rodar Migrações

```bash
python manage.py makemigrations
python manage.py migrate
```

## 🔄 Mudanças nas Views/Serializers

### 1. Atualizar o Serializer para retornar dados completos

```python
# backend/serializers.py

from .models import OrdemExpressaEnsaio, OrdemExpressaCalculo

class OrdemExpressaSerializer(serializers.ModelSerializer):
    ensaio_detalhes = serializers.SerializerMethodField()
    calculo_ensaio_detalhes = serializers.SerializerMethodField()
    
    def get_ensaio_detalhes(self, obj):
        """
        Retorna ensaios da tabela intermediária preservando:
        - Duplicatas (mesmo ensaio, diferentes laboratórios)
        - Ordem de exibição
        - Dados de laboratório
        """
        ensaios_intermediarios = OrdemExpressaEnsaio.objects.filter(
            ordem_expressa=obj
        ).select_related('ensaio').order_by('ordem')
        
        result = []
        for item in ensaios_intermediarios:
            # Serializar dados do ensaio
            ensaio_data = EnsaioSerializer(item.ensaio).data
            
            # Adicionar campos da tabela intermediária
            ensaio_data['laboratorio'] = item.laboratorio
            ensaio_data['laboratorio_original'] = item.laboratorio_original
            ensaio_data['somente_leitura'] = item.somente_leitura
            
            result.append(ensaio_data)
        
        return result
    
    def get_calculo_ensaio_detalhes(self, obj):
        """
        Retorna cálculos da tabela intermediária preservando duplicatas
        """
        calculos_intermediarios = OrdemExpressaCalculo.objects.filter(
            ordem_expressa=obj
        ).select_related('calculo').order_by('ordem')
        
        result = []
        for item in calculos_intermediarios:
            calculo_data = CalculoEnsaioSerializer(item.calculo).data
            calculo_data['laboratorio'] = item.laboratorio
            calculo_data['laboratorio_original'] = item.laboratorio_original
            calculo_data['somente_leitura'] = item.somente_leitura
            result.append(calculo_data)
        
        return result
    
    class Meta:
        model = OrdemExpressa
        fields = '__all__'
```

### 2. Atualizar a View para processar dados completos

```python
# backend/views.py

from rest_framework import viewsets
from rest_framework.response import Response
from .models import OrdemExpressa, OrdemExpressaEnsaio, OrdemExpressaCalculo

class OrdemExpressaViewSet(viewsets.ModelViewSet):
    queryset = OrdemExpressa.objects.all()
    serializer_class = OrdemExpressaSerializer
    
    def partial_update(self, request, *args, **kwargs):
        """
        PATCH /ordem/expressa/{id}/
        
        Payload esperado:
        {
            "ensaios": [
                {"id": 76, "laboratorio": "LAR", "somente_leitura": false},
                {"id": 81, "laboratorio": "LAR", "somente_leitura": false},
                {"id": 76, "laboratorio": "LCE", "somente_leitura": true}  // Duplicata!
            ],
            "calculos_ensaio": [
                {"id": 93, "laboratorio": "LAR", "somente_leitura": false}
            ]
        }
        """
        ordem = self.get_object()
        ensaios_data = request.data.get('ensaios', [])
        calculos_data = request.data.get('calculos_ensaio', [])
        
        # ===== PROCESSAR ENSAIOS =====
        # Limpar ensaios existentes
        OrdemExpressaEnsaio.objects.filter(ordem_expressa=ordem).delete()
        
        # Criar novos registros preservando duplicatas e ordem
        for idx, ensaio_item in enumerate(ensaios_data):
            if isinstance(ensaio_item, dict):
                # Payload novo: objeto com laboratorio
                OrdemExpressaEnsaio.objects.create(
                    ordem_expressa=ordem,
                    ensaio_id=ensaio_item.get('id'),
                    laboratorio=ensaio_item.get('laboratorio'),
                    laboratorio_original=ensaio_item.get('laboratorio_original'),
                    somente_leitura=ensaio_item.get('somente_leitura', False),
                    ordem=idx
                )
            else:
                # Payload antigo: apenas ID (compatibilidade)
                OrdemExpressaEnsaio.objects.create(
                    ordem_expressa=ordem,
                    ensaio_id=ensaio_item,
                    ordem=idx
                )
        
        # ===== PROCESSAR CÁLCULOS =====
        OrdemExpressaCalculo.objects.filter(ordem_expressa=ordem).delete()
        
        for idx, calculo_item in enumerate(calculos_data):
            if isinstance(calculo_item, dict):
                OrdemExpressaCalculo.objects.create(
                    ordem_expressa=ordem,
                    calculo_id=calculo_item.get('id'),
                    laboratorio=calculo_item.get('laboratorio'),
                    laboratorio_original=calculo_item.get('laboratorio_original'),
                    somente_leitura=calculo_item.get('somente_leitura', False),
                    ordem=idx
                )
            else:
                OrdemExpressaCalculo.objects.create(
                    ordem_expressa=ordem,
                    calculo_id=calculo_item,
                    ordem=idx
                )
        
        # Retornar dados atualizados
        serializer = self.get_serializer(ordem)
        return Response(serializer.data)
```

## ✅ Checklist de Implementação

- [ ] Adicionar `through='OrdemExpressaEnsaio'` no campo `ensaios` do modelo `OrdemExpressa`
- [ ] Adicionar `through='OrdemExpressaCalculo'` no campo `calculos_ensaio` do modelo `OrdemExpressa`
- [ ] Criar/atualizar modelos `OrdemExpressaEnsaio` e `OrdemExpressaCalculo`
- [ ] Rodar `makemigrations` e `migrate`
- [ ] Atualizar `OrdemExpressaSerializer` com métodos `get_ensaio_detalhes()` e `get_calculo_ensaio_detalhes()`
- [ ] Atualizar método `partial_update()` na ViewSet para processar objetos completos
- [ ] Testar endpoint PATCH com payload contendo duplicatas
- [ ] Verificar que GET retorna todos os ensaios incluindo duplicatas

## 🧪 Teste

### 1. Enviar dados com duplicatas:

```bash
curl -X PATCH https://managerdb.com.br/api/ordem/expressa/23/ \
  -H "Content-Type: application/json" \
  -d '{
    "ensaios": [
      {"id": 76, "laboratorio": "LAR", "somente_leitura": false},
      {"id": 81, "laboratorio": "LAR", "somente_leitura": false},
      {"id": 76, "laboratorio": "LCE", "somente_leitura": true}
    ],
    "calculos_ensaio": [
      {"id": 93, "laboratorio": "LAR", "somente_leitura": false}
    ]
  }'
```

### 2. Verificar que retorna 3 ensaios (incluindo o ID 76 duas vezes):

```bash
curl https://managerdb.com.br/api/ordem/expressa/23/
```

Esperado:
```json
{
  "id": 23,
  "ensaio_detalhes": [
    {"id": 76, "descricao": "...", "laboratorio": "LAR", "somente_leitura": false},
    {"id": 81, "descricao": "...", "laboratorio": "LAR", "somente_leitura": false},
    {"id": 76, "descricao": "...", "laboratorio": "LCE", "somente_leitura": true}
  ]
}
```

## 📝 Observações

1. **Compatibilidade**: O código suporta tanto o payload antigo (apenas IDs) quanto o novo (objetos completos)
2. **Ordem preservada**: O campo `ordem` mantém a sequência de exibição
3. **Duplicatas permitidas**: Mesmo ID pode aparecer múltiplas vezes com laboratórios diferentes
4. **Cascade delete**: Ao deletar a ordem expressa, os registros intermediários são removidos automaticamente
