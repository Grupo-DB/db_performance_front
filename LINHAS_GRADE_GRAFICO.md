# Configuração de Linhas de Grade no Gráfico

## Problema Resolvido

As imagens baixadas do gráfico agora incluem **linhas de grade visíveis** para melhor leitura e análise dos dados.

## Alterações Implementadas

### 1. Configuração das Escalas do Gráfico

#### ✅ **Eixo X (Raiz t):**
```typescript
x: {
    type: 'linear', 
    title: { display: true, text: 'Raiz t (h¹/²)' },
    grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)',
        lineWidth: 1,
        drawOnChartArea: true,
        drawTicks: true
    },
    ticks: {
        display: true,
        color: '#666'
    }
}
```

#### ✅ **Eixo Y (Δm):**
```typescript
y: {
    type: 'linear', 
    title: { display: true, text: 'Δm (kg/m²)' }, 
    beginAtZero: true,
    grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)',
        lineWidth: 1,
        drawOnChartArea: true,
        drawTicks: true
    },
    ticks: {
        display: true,
        color: '#666'
    }
}
```

### 2. Configurações de Renderização

#### ✅ **Animação Desabilitada:**
```typescript
animation: {
    duration: 0 // Melhora exportação de imagem
}
```

#### ✅ **Interação Otimizada:**
```typescript
interaction: {
    intersect: false,
    mode: 'index'
}
```

### 3. Processo de Exportação Melhorado

#### ✅ **Forçar Re-renderização:**
```typescript
// Antes de capturar a imagem
if (this.chartInstance) {
    this.chartInstance.update('none'); // Update sem animação
}
```

#### ✅ **Delay Aumentado:**
- **Salvamento:** 500ms → **800ms**
- **Download:** **200ms** (novo)
- **Motivo:** Garantir renderização completa das linhas de grade

## Características das Linhas de Grade

### 📏 **Aparência:**
- **Cor:** `rgba(0, 0, 0, 0.1)` (cinza claro e transparente)
- **Espessura:** `1px`
- **Estilo:** Linhas sólidas
- **Visibilidade:** Tanto na tela quanto na imagem exportada

### 🎯 **Funcionalidade:**
- **drawOnChartArea:** `true` - Desenha na área do gráfico
- **drawTicks:** `true` - Desenha nas marcações dos eixos
- **display:** `true` - Sempre visível

### 🔧 **Configuração dos Ticks:**
- **Cor:** `#666` (cinza médio)
- **Visibilidade:** Sempre exibidos
- **Posicionamento:** Automático baseado nos dados

## Resultado Visual

### Antes (sem linhas de grade):
```
📊 Gráfico limpo, mas difícil de ler valores precisos
📏 Dificulta estimativa de coordenadas
🔍 Análise visual limitada
```

### Depois (com linhas de grade):
```
📊 Gráfico profissional com grade de referência
📏 Fácil leitura de valores aproximados
🔍 Análise visual precisa e facilitada
📐 Aparência científica adequada
```

## Como Verificar

### 1. **No Navegador:**
1. Abra o gráfico de capilaridade
2. Preencha dados experimentais
3. Verifique se as linhas de grade aparecem no gráfico

### 2. **Na Imagem Exportada:**
1. Clique em "Download Imagem" ou "Salvar Imagem no Banco"
2. Abra a imagem baixada/salva
3. Confirme que as linhas de grade estão visíveis

### 3. **Teste de Qualidade:**
- ✅ Linhas horizontais e verticais presentes
- ✅ Cor clara que não interfere nos dados
- ✅ Espaçamento adequado entre linhas
- ✅ Ticks dos eixos alinhados com a grade

## Benefícios da Implementação

### 📊 **Para Análise Científica:**
- Facilita leitura de valores intermediários
- Melhora precisão visual das medições
- Padroniza apresentação científica

### 👥 **Para Usuários:**
- Interface mais profissional
- Melhor experiência de análise
- Relatórios mais apresentáveis

### 🔧 **Para Sistema:**
- Configuração padrão mantida
- Performance não afetada
- Compatibilidade com todos os navegadores

## Configurações Técnicas

### Cores Recomendadas:
- **Grade:** `rgba(0, 0, 0, 0.1)` - Discreta mas visível
- **Ticks:** `#666` - Legível sem ser intrusivo
- **Alternativa clara:** `rgba(0, 0, 0, 0.05)` - Ainda mais suave
- **Alternativa escura:** `rgba(0, 0, 0, 0.15)` - Mais evidente

### Espessuras Disponíveis:
- **Sutil:** `0.5px` - Muito discreta
- **Padrão:** `1px` - Equilibrada (atual)
- **Evidente:** `1.5px` - Mais marcante

## Personalização Futura

### Possíveis Melhorias:
1. **Controle do usuário:** Toggle para mostrar/ocultar grade
2. **Estilos diferentes:** Linha pontilhada, tracejada
3. **Cores temáticas:** Grade que combina com tema do sistema
4. **Grade secundária:** Subdivisões menores
5. **Grade radial:** Para outros tipos de gráfico

### Código para Toggle (exemplo):
```typescript
// Adicionar propriedade
mostrarGrade: boolean = true;

// Modificar configuração
grid: {
    display: this.mostrarGrade,
    // ... outras configurações
}
```

## Status

✅ **Implementado e funcionando**
✅ **Testado em diferentes navegadores**
✅ **Compatível com exportação PNG**
✅ **Performance otimizada**
✅ **Documentação atualizada**

As linhas de grade agora aparecem corretamente nas imagens PNG baixadas! 🎯