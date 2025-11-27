# Solução para Erro de Chunks do Vite

## Problema
O Vite estava gerando erros recorrentes ao iniciar o servidor:
```
The file does not exist at ".../.angular/cache/.../chunk-XXXXX.js" which is in the optimize deps directory.
```

## Causa
O sistema de otimização de dependências do Vite (`optimizeDeps`) estava criando chunks em cache que ficavam corrompidos ou desatualizados entre reinicializações.

## Solução Implementada

### 1. Desabilitação da Otimização de Dependências
No arquivo `vite.config.ts`, a otimização de dependências foi **completamente desabilitada**:

```typescript
optimizeDeps: {
  disabled: true
}
```

**Consequência:** O servidor pode demorar um pouco mais para iniciar na primeira vez, mas não haverá mais problemas de chunks corrompidos.

### 2. Scripts de Limpeza
Adicionados scripts no `package.json`:

- `npm run clean` - Limpa todos os caches (.angular, node_modules/.vite, dist)
- `npm run clean:start` - Limpa e inicia o servidor

### 3. .gitignore Atualizado
Garantido que os diretórios de cache não sejam versionados:
- `/.angular/cache`
- `/node_modules/.vite`

## Como Usar

### Início Normal
```bash
npm start
```

### Se Encontrar Problemas
```bash
npm run clean:start
```

### Limpeza Manual
```bash
rm -rf .angular node_modules/.vite dist
npm start
```

## Observações

- **Performance:** Com `optimizeDeps.disabled: true`, o primeiro carregamento pode ser um pouco mais lento, mas é mais estável
- **Hot Reload:** Continua funcionando normalmente
- **Build de Produção:** Não é afetado por essa configuração

## Alternativa (se performance for crítica)

Se precisar da otimização de deps, pode tentar:
```typescript
optimizeDeps: {
  disabled: false,
  force: true, // Força reconstrução sempre
  exclude: []
}
```

Mas isso pode causar builds mais lentos e os erros podem voltar.
