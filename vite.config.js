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
      '/api': {
        target: 'https://lumixora.in',
        changeOrigin: true
      },
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
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: true,
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('pdfjs-dist')) return 'pdf-worker';
            if (id.includes('monaco-editor') || id.includes('@monaco-editor')) return 'monaco-vendor';
            if (id.includes('mermaid')) return 'mermaid';
            if (id.includes('katex')) return 'katex';
            if (id.includes('three')) return 'three-vendor';
            if (id.includes('xlsx') || id.includes('exceljs')) return 'excel-vendor';
            if (id.includes('recharts')) return 'recharts-vendor';
            if (id.includes('framer-motion')) return 'motion-vendor';
            if (id.includes('jspdf')) return 'jspdf-vendor';
            if (id.includes('html2canvas')) return 'html2canvas-vendor';
            if (id.includes('qrcode')) return 'qrcode-vendor';
            if (id.includes('dompurify') || id.includes('marked')) return 'markdown-vendor';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('@supabase') || id.includes('supabase')) return 'supabase';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-is') || id.includes('scheduler')) return 'react-vendor';
          }
          if (id.includes('codingProblemBank10k')) return 'coding-bank-10k';
          if (id.includes('gprecSecureExamBank')) return 'exam-bank';
        }
      }
    }
  }
})
