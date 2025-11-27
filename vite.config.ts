import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    // Desabilitar completamente a otimização de dependências para evitar problemas de chunks
    disabled: true
  },
  server: {
    fs: {
      strict: false,
    },
    // Forçar recarga completa ao invés de usar cache
    watch: {
      ignored: ['!**/node_modules/**']
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
