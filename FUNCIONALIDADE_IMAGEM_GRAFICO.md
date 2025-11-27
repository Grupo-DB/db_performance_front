# Funcionalidade: Gerar e Salvar Imagem do Gráfico

## Descrição
Esta funcionalidade permite gerar uma imagem PNG a partir do gráfico de absorção de água por capilaridade e salvá-la diretamente no banco de dados associada à amostra, ou fazer o download local da imagem.

## Implementação

### Componente: AnaliseComponent
**Arquivo:** `src/app/pages/controleQualidade/analise/analise.component.ts`

#### Novos Métodos Adicionados:

1. **`gerarESalvarImagemGrafico()`**
   - Gera uma imagem PNG do gráfico atual
   - Salva a imagem no banco de dados via API
   - Inclui descrição detalhada com dados do cálculo
   - Exibe feedback de sucesso/erro ao usuário

2. **`gerarDescricaoGrafico()`** (privado)
   - Gera descrição detalhada do gráfico
   - Inclui dados da amostra, resultados calculados e pontos experimentais
   - Formato de texto legível para documentação

3. **`downloadImagemGrafico()`**
   - Gera download direto da imagem do gráfico
   - Não salva no banco, apenas baixa para o computador local
   - Nome do arquivo inclui timestamp para organização

#### Nova Propriedade:
- **`salvandoImagemGrafico: boolean`** - Controla o estado de loading durante o salvamento

### Template HTML
**Arquivo:** `src/app/pages/controleQualidade/analise/analise.component.html`

#### Novos Botões Adicionados:
- **"Salvar Imagem no Banco"** - Botão verde com ícone de upload
- **"Download Imagem"** - Botão azul com ícone de download

Ambos os botões ficam desabilitados quando não há gráfico carregado.

### Estilos CSS
**Arquivo:** `src/app/pages/controleQualidade/analise/analise.component.scss`

#### Novos Estilos:
- Estilos para os botões no modal do gráfico
- Animação de loading para o botão de salvar
- Responsividade e aparência melhorada

## Como Usar

### 1. Acessar o Gráfico
1. Entre em uma análise de controle de qualidade
2. Clique em "Gráfico Capilaridade" no menu de argamassa
3. Preencha os dados experimentais
4. O gráfico será gerado automaticamente

### 2. Salvar Imagem no Banco
1. Com o gráfico gerado, clique em "Salvar Imagem no Banco"
2. A imagem será processada e enviada para o servidor
3. Uma mensagem de sucesso confirmará o salvamento
4. A imagem ficará disponível na galeria de imagens da amostra

### 3. Download Local
1. Com o gráfico gerado, clique em "Download Imagem"
2. A imagem será baixada automaticamente para seu computador
3. Nome do arquivo: `grafico-capilaridade-DD-MM-AAAA.png`

## Características Técnicas

### Formato da Imagem
- **Formato:** PNG
- **Qualidade:** 95%
- **Resolução:** Baseada no tamanho do canvas (800x500px padrão)
- **Vantagem:** Sem perda de qualidade, ideal para gráficos científicos
- **Linhas de Grade:** Incluídas automaticamente para melhor leitura

### Descrição Automática
A imagem salva no banco inclui uma descrição detalhada contendo:
- Título: "Gráfico de Absorção de Água por Capilaridade"
- Data/hora de geração
- Número da amostra
- Formato e qualidade da imagem (PNG 95%)
- Coeficiente Aw calculado
- Inclinação da linha de tendência
- Intercepto
- Coeficiente de determinação (R²)
- Número de pontos experimentais
- Lista dos pontos experimentais (se ≤ 10 pontos)

### Integração com API
Utiliza o serviço existente `AmostraService.uploadImagens()` para enviar a imagem:
- **Endpoint:** `POST /amostra/{id}/upload_images/`
- **Formato:** FormData com arquivo PNG e descrição
- **Autenticação:** Utiliza token JWT existente

## Tratamento de Erros

### Validações Implementadas:
- Verifica se o gráfico está carregado antes de gerar imagem
- Verifica se a amostra está identificada
- Trata erros de conversão de canvas para imagem
- Trata erros de upload para o servidor

### Mensagens de Erro:
- **401:** "Sessão expirada. Faça login novamente."
- **413:** "A imagem gerada é muito grande. Tente reduzir a resolução."
- **Geral:** "Falha ao salvar imagem do gráfico. Tente novamente."

## Dependências

### Serviços Utilizados:
- `AmostraService` - Para upload de imagens
- `MessageService` - Para exibir feedback ao usuário

### APIs do Browser:
- `HTMLCanvasElement.toBlob()` - Para converter canvas em imagem
- `HTMLCanvasElement.toDataURL()` - Para download direto
- `FormData` - Para envio multipart ao servidor

## Compatibilidade
- **Navegadores:** Todos os navegadores modernos que suportam Canvas API
- **Dispositivos:** Desktop e mobile (com algumas limitações de resolução)

## Exemplo de Uso Completo

```typescript
// No componente, após gerar o gráfico
this.exibirGrafico(); // Abre o modal do gráfico
// ... usuário preenche dados e gráfico é gerado automaticamente
// ... usuário clica em "Salvar Imagem no Banco"
this.gerarESalvarImagemGrafico(); // Executa o salvamento
```

## Possíveis Melhorias Futuras

1. **Configuração de Qualidade:** Permitir ao usuário escolher a qualidade da imagem
2. **Múltiplos Formatos:** Suporte para JPEG, SVG além de PNG
3. **Redimensionamento:** Opções de tamanho da imagem antes do salvamento
4. **Marca d'água:** Adicionar marca d'água institucional
5. **Histórico:** Visualizar histórico de imagens geradas para cada amostra
6. **Compartilhamento:** Funcionalidades de compartilhamento via email/WhatsApp

## Notas de Desenvolvimento

- A implementação reutiliza componentes e serviços existentes
- Mantém a consistência com o padrão de UI/UX do sistema
- Código bem documentado e tratamento de erros robusto
- Fácil manutenção e extensão