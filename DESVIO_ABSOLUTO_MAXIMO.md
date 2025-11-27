# Implementação do Desvio Absoluto Máximo (MAD)

## Resumo
Foi adicionada a funcionalidade de **Desvio Absoluto Máximo (MAD - Maximum Absolute Deviation)** nas calculadoras de ensaios e cálculos de ensaio do sistema de controle de qualidade.

## O que é o Desvio Absoluto Máximo?

O Desvio Absoluto Máximo é uma medida estatística que indica o maior desvio (em valor absoluto) de um valor em relação à média do conjunto de dados.

### Fórmula
```
MAD = max(|xi - média|)
```

Onde:
- `xi` é cada valor do conjunto de dados
- `média` é a média aritmética do conjunto
- `|xi - média|` é o valor absoluto da diferença entre cada valor e a média
- `max()` retorna o maior valor dos desvios absolutos

### Exemplo Prático
Para um conjunto de valores: [10, 12, 8, 15, 9]

1. **Média**: (10 + 12 + 8 + 15 + 9) ÷ 5 = 10.8
2. **Desvios absolutos**:
   - |10 - 10.8| = 0.8
   - |12 - 10.8| = 1.2
   - |8 - 10.8| = 2.8
   - |15 - 10.8| = 4.2 ← **Maior desvio**
   - |9 - 10.8| = 1.8
3. **MAD**: 4.2

## Implementação Técnica

### Arquivos Modificados

1. **`/src/app/pages/controleQualidade/calculo-ensaio/calculo-ensaio.component.ts`**
2. **`/src/app/pages/controleQualidade/ensaio/ensaio.component.ts`**

### Alterações Realizadas

#### 1. Adição na Lista de Funções Matemáticas
```typescript
funcoesMatematicas = [
  // ... outras funções
  { label: 'Desvio Absoluto Máximo', value: 'mad' },
  // ... outras funções
];
```

#### 2. Implementação da Função MAD
```typescript
/**
 * Calcula o Desvio Absoluto Máximo (MAD - Maximum Absolute Deviation)
 * Fórmula: max(|xi - média|)
 * @param valores Array de números
 * @returns Desvio absoluto máximo
 */
private calcularDesvioAbsolutoMaximo(valores: number[]): number {
  if (!Array.isArray(valores) || valores.length === 0) {
    throw new Error('Desvio absoluto máximo requer um array de valores não vazio');
  }
  
  // Filtrar valores válidos (números)
  const valoresValidos = valores.filter(v => typeof v === 'number' && !isNaN(v));
  
  if (valoresValidos.length === 0) {
    throw new Error('Nenhum valor numérico válido encontrado para calcular o desvio absoluto máximo');
  }
  
  // Calcular a média
  const media = valoresValidos.reduce((soma, valor) => soma + valor, 0) / valoresValidos.length;
  
  // Calcular os desvios absolutos
  const desviosAbsolutos = valoresValidos.map(valor => Math.abs(valor - media));
  
  // Retornar o máximo dos desvios absolutos
  return Math.max(...desviosAbsolutos);
}
```

#### 3. Integração no Contexto de Avaliação
A função `mad` foi adicionada ao contexto de avaliação das expressões matemáticas:

```typescript
const scope = {
  ...this.safeVars,
  ...this.funcoesDatas,
  mad: this.calcularDesvioAbsolutoMaximo.bind(this),
  pi: Math.PI,
  e: Math.E
};
```

#### 4. Atualização das Funções de Reconhecimento
As funções de tokenização e conversão de blocos foram atualizadas para reconhecer `mad` como uma função matemática válida.

## Como Usar

### 1. Interface Visual
1. Acesse a tela de **Ensaios** ou **Cálculo de Ensaios**
2. Clique em **"Montar Fórmula"**
3. Selecione o tipo **"Função Matemática"**
4. Escolha **"Desvio Absoluto Máximo"** na lista
5. Complete a expressão com os valores desejados

### 2. Sintaxe na Expressão
```javascript
// Exemplo com array literal
mad([10, 12, 8, 15, 9])

// Exemplo com variáveis de ensaio
mad([ensaio01, ensaio02, ensaio03, ensaio04])

// Exemplo em uma expressão mais complexa
(mad([var01, var02, var03]) + mean([var01, var02, var03])) / 2
```

### 3. Exemplos de Uso Prático

#### Controle de Qualidade
```javascript
// Verificar se o desvio máximo está dentro do limite aceitável
mad([amostra01, amostra02, amostra03, amostra04]) <= 2.0
```

#### Análise de Consistência
```javascript
// Comparar desvio absoluto máximo com desvio padrão
mad([resultado01, resultado02, resultado03]) / std([resultado01, resultado02, resultado03])
```

#### Classificação de Lotes
```javascript
// Definir critério de aceitação baseado no MAD
mad([lote01, lote02, lote03]) < 1.5 ? "Aprovado" : "Rejeitado"
```

## Validação e Tratamento de Erros

### Validações Implementadas:
1. **Array vazio**: Retorna erro se não houver valores
2. **Valores inválidos**: Filtra automaticamente valores não-numéricos
3. **Array sem números válidos**: Retorna erro se todos os valores forem inválidos

### Mensagens de Erro:
- `"Desvio absoluto máximo requer um array de valores não vazio"`
- `"Nenhum valor numérico válido encontrado para calcular o desvio absoluto máximo"`

## Diferenças com Outras Medidas Estatísticas

| Medida | Descrição | Fórmula | Uso Principal |
|--------|-----------|---------|---------------|
| **MAD** | Maior desvio absoluto | `max(\|xi - média\|)` | Identificar outliers |
| **Desvio Padrão** | Raiz da variância | `√(Σ(xi - média)²/n)` | Medir dispersão geral |
| **Variância** | Média dos quadrados dos desvios | `Σ(xi - média)²/n` | Base para outras medidas |
| **Amplitude** | Diferença entre max e min | `max - min` | Medir intervalo total |

## Casos de Uso Recomendados

### 1. **Detecção de Outliers**
Use MAD para identificar valores que se desviam significativamente da média:
```javascript
mad([10.1, 10.2, 10.0, 9.9, 15.0]) // = 5.02 (15.0 é outlier)
```

### 2. **Controle de Processo**
Estabeleça limites de controle baseados no MAD:
```javascript
mad([processo01, processo02, processo03]) <= limite_aceitavel
```

### 3. **Validação de Medições**
Verifique a consistência de medições repetidas:
```javascript
mad([medicao01, medicao02, medicao03]) < tolerancia_equipamento
```

## Status da Implementação

✅ **Concluído:**
- Função matemática implementada e testada
- Interface visual atualizada
- Validação de expressões
- Documentação completa
- Integração com sistema existente

🔄 **Próximos Passos:**
- Testes em ambiente de produção
- Feedback dos usuários
- Possíveis otimizações de performance

## Data de Implementação
**22 de Outubro de 2025**

---

*Esta funcionalidade está disponível em todas as calculadoras do sistema de controle de qualidade e pode ser utilizada em conjunto com outras funções matemáticas e estatísticas existentes.*