# Como Testar a Funcionalidade de Salvar Imagem do Gráfico

## Pré-requisitos
1. Sistema rodando localmente ou em ambiente de desenvolvimento
2. Usuário com permissões adequadas (Admin, Master, LabGestor, LabOp)
3. Uma amostra existente no sistema

## Passo a Passo para Testar

### 1. Acessar uma Análise
```
1. Navegue para: Sistema → Controle de Qualidade → Amostras
2. Escolha uma amostra existente
3. Entre na análise da amostra
```

### 2. Abrir o Gráfico de Capilaridade
```
1. Procure pela seção de "Argamassa" ou menu lateral
2. Clique em "Gráfico Capilaridade"
3. Um modal/drawer será aberto com o formulário do gráfico
```

### 3. Preencher Dados de Teste
```
Use estes dados de exemplo para testar:

Tempo    | Raiz t (h¹/²) | Δm (kg/m²)
---------|---------------|----------
5min     | 0.29          | 2.30
20min    | 0.57          | 4.10
1h       | 1.00          | 6.85
2h       | 1.41          | 8.35
4h       | 2.00          | 12.00
6h       | 2.45          | 15.20
```

### 4. Verificar Geração do Gráfico
```
1. O gráfico deve aparecer automaticamente ao preencher os dados
2. Verifique se apareceram os resultados calculados:
   - Aw (coeficiente)
   - R² (coeficiente de determinação)
   - Linha de tendência no gráfico
```

### 5. Testar Salvamento no Banco
```
1. Clique no botão "Salvar Imagem no Banco" (verde com ícone de upload)
2. Observe:
   - Botão fica em estado de loading
   - Mensagem de sucesso/erro aparece
   - Status do salvamento
```

### 6. Testar Download Local
```
1. Clique no botão "Download Imagem" (azul com ícone de download)
2. Verifique:
   - Arquivo PNG é baixado automaticamente
   - Nome do arquivo: grafico-capilaridade-DD-MM-AAAA.png
   - Qualidade da imagem está adequada
```

### 7. Verificar Imagem Salva no Banco
```
1. Feche o modal do gráfico
2. Procure pela opção "Visualizar Imagens" ou similar na interface da amostra
3. Verifique se a nova imagem do gráfico aparece na galeria
4. Confira se a descrição automática foi salva corretamente
```

## Cenários de Erro para Testar

### 1. Tentar Salvar Sem Gráfico
```
1. Abra o modal do gráfico
2. NÃO preencha dados ou limpe todos os campos
3. Tente clicar em "Salvar Imagem no Banco"
4. Deve aparecer: "Nenhum gráfico disponível para capturar"
```

### 2. Problemas de Conectividade
```
1. Desconecte a internet ou pare o servidor backend
2. Preencha dados e gere o gráfico
3. Tente salvar a imagem
4. Deve aparecer mensagem de erro de conexão
```

### 3. Sessão Expirada
```
1. Deixe o sistema aberto por muito tempo até a sessão expirar
2. Tente salvar uma imagem
3. Deve aparecer: "Sessão expirada. Faça login novamente."
```

## Verificações de Qualidade

### 1. Qualidade da Imagem
- [ ] Resolução adequada (não pixelizada)
- [ ] Texto legível nos eixos e legendas
- [ ] Linhas de grade visíveis e bem posicionadas
- [ ] Cores consistentes com o tema do sistema
- [ ] Proporções corretas

### 2. Dados na Descrição
- [ ] Nome da amostra correto
- [ ] Data/hora de geração atual
- [ ] Valores calculados presentes (Aw, R², etc.)
- [ ] Pontos experimentais listados

### 3. Performance
- [ ] Tempo de salvamento razoável (< 5 segundos)
- [ ] Interface não trava durante o processo
- [ ] Feedback visual adequado (loading, mensagens)

### 4. Integração
- [ ] Imagem aparece na galeria da amostra
- [ ] Pode ser visualizada/baixada posteriormente
- [ ] Não conflita com outras imagens existentes

## Valores de Teste Adicionais

### Dados Mínimos (2 pontos):
```
Tempo | Raiz t | Δm
------|--------|----
5min  | 0.29   | 2.30
1h    | 1.00   | 6.85
```

### Dados Completos (9 pontos):
```
Tempo    | Raiz t | Δm
---------|--------|-------
5min     | 0.29   | 2.30
20min    | 0.57   | 4.10
1h       | 1.00   | 6.85
2h       | 1.41   | 8.35
4h       | 2.00   | 12.00
6h       | 2.45   | 15.20
8h       | 2.83   | 17.85
22:30h   | 4.74   | 25.40
24h      | 4.90   | 26.10
```

## Comandos para Desenvolvedores

### Verificar Logs de Erro (Frontend):
```javascript
// No console do navegador (F12)
console.log('Erro capturado:', error);
```

### Verificar Logs do Backend:
```bash
# Se usando Django
tail -f logs/django.log

# Ou verificar diretamente no terminal onde roda o backend
```

### Debug do FormData:
```javascript
// No console, após chamada da API
for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
}
```

## Resultado Esperado

Ao final do teste bem-sucedido, você deve ter:

1. ✅ Uma imagem PNG do gráfico salva no banco de dados
2. ✅ Descrição detalhada associada à imagem
3. ✅ Arquivo PNG baixado localmente
4. ✅ Mensagens de feedback apropriadas
5. ✅ Performance adequada do sistema

## Problemas Comuns e Soluções

### "Canvas is tainted" erro:
- Verifique configurações de CORS no servidor
- Certifique-se que não há recursos externos no gráfico

### "Failed to fetch" erro:
- Verifique se o backend está rodando
- Confirme a URL da API no service

### Imagem muito grande:
- Ajuste a resolução do canvas se necessário
- Considere compressão adicional

### Performance lenta:
- Verifique tamanho dos dados de entrada
- Optimize a renderização do gráfico se necessário