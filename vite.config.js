import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/groq-api': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/groq-api/, '')
      }
    },
    watch: {
      ignored: ['**/android/**']
    }
  },
  optimizeDeps: {
    entries: ['index.html']
  },
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('pdfjs-dist')) return 'pdf-worker';
            if (id.includes('monaco-editor')) return 'monaco-editor';
            if (id.includes('mermaid')) return 'mermaid';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
          }
        }
      }
    }
  }
})
