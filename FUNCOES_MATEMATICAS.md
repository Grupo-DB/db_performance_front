# Funções Matemáticas Disponíveis nas Calculadoras

Este documento descreve as novas funções matemáticas implementadas no sistema de calculadoras de ensaios e cálculos de ensaios.

## Funções Básicas

### Raiz Quadrada
- **Função:** `sqrt(x)`
- **Descrição:** Calcula a raiz quadrada de um número
- **Exemplo:** `sqrt(25)` = 5

### Potência
- **Função:** `pow(x, y)`
- **Descrição:** Calcula x elevado à potência y
- **Exemplo:** `pow(2, 3)` = 8

### Logaritmos
- **Função:** `log(x)` - Logaritmo natural
- **Função:** `log10(x)` - Logaritmo base 10
- **Exemplo:** `log(2.718)` ≈ 1, `log10(100)` = 2

### Exponencial
- **Função:** `exp(x)`
- **Descrição:** Calcula e^x
- **Exemplo:** `exp(1)` ≈ 2.718

## Funções Trigonométricas

- **sin(x):** Seno (x em radianos)
- **cos(x):** Cosseno (x em radianos)
- **tan(x):** Tangente (x em radianos)
- **asin(x):** Arco seno
- **acos(x):** Arco cosseno
- **atan(x):** Arco tangente

**Exemplo:** `sin(pi/2)` = 1

## Funções de Arredondamento

- **round(x):** Arredonda para o inteiro mais próximo
- **floor(x):** Arredonda para baixo (piso)
- **ceil(x):** Arredonda para cima (teto)
- **abs(x):** Valor absoluto

**Exemplos:**
- `round(3.7)` = 4
- `floor(3.7)` = 3
- `ceil(3.2)` = 4
- `abs(-5)` = 5

## Funções Estatísticas

### Para Arrays de Valores
- **mean([x1, x2, ...]):** Média aritmética
- **median([x1, x2, ...]):** Mediana
- **mode([x1, x2, ...]):** Modo (valor mais frequente)
- **std([x1, x2, ...]):** Desvio padrão
- **var([x1, x2, ...]):** Variância
- **min([x1, x2, ...]):** Valor mínimo
- **max([x1, x2, ...]):** Valor máximo
- **sum([x1, x2, ...]):** Soma dos valores

**Exemplos:**
- `mean([1, 2, 3, 4, 5])` = 3
- `std([1, 2, 3, 4, 5])` ≈ 1.58
- `max([10, 5, 8, 3])` = 10

## Constantes Matemáticas

- **pi:** π (3.14159...)
- **e:** Euler (2.71828...)

**Exemplos:**
- `pi * 2` ≈ 6.283
- `e * 2` ≈ 5.437

## Como Usar no Sistema

### 1. No Montador de Fórmulas
1. Selecione o tipo "Função Matemática" 
2. Escolha a função desejada no dropdown
3. Complete com os parâmetros necessários usando delimitadores

### 2. Exemplos de Expressões Completas

**Cálculo de área do círculo:**
```
pi * pow(raio, 2)
```

**Cálculo de média de ensaios:**
```
mean([ensaio1, ensaio2, ensaio3])
```

**Cálculo com condicionais:**
```
abs(valor) > 10 ? sqrt(valor) : valor * 2
```

**Normalização estatística:**
```
(valor - mean([valor1, valor2, valor3])) / std([valor1, valor2, valor3])
```

### 3. Validação Automática
- O sistema valida automaticamente as expressões durante a montagem
- Funções estatísticas são testadas com arrays de exemplo
- Mensagens de erro indicam problemas de sintaxe

### 4. Tipos de Dados Suportados
- Números decimais
- Arrays para funções estatísticas (usando colchetes [])
- Variáveis de ensaios
- Cálculos de ensaios anteriores

## Notas Importantes

1. **Arrays:** Para funções estatísticas, use a sintaxe `[valor1, valor2, valor3]`
2. **Ângulos:** Funções trigonométricas esperam valores em radianos
3. **Precedência:** Use parênteses para controlar a ordem de operação
4. **Validação:** O sistema testa automaticamente as expressões antes de salvar

## Exemplos Avançados

### Controle de Qualidade
```
abs(resultado - meta) <= tolerancia ? "Aprovado" : "Reprovado"
```

### Análise Estatística
```
resultado > (mean(historico) + 2 * std(historico)) ? "Outlier" : "Normal"
```

### Cálculos Físicos
```
sqrt(pow(velocidade, 2) + pow(aceleracao * tempo, 2))
```