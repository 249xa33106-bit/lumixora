import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'katex/dist/katex.min.css'
import './index.css'
import App from './App.jsx'

import ErrorBoundary from './components/ErrorBoundary.jsx'

console.log("App Version: 1.1.21 - Force Refreshed");

// Register Offline Service Worker for alarms & offline PWA, ensuring immediate update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('ServiceWorker registered:', reg.scope);
        reg.update().catch(() => {});
      })
      .catch(err => console.log('ServiceWorker registration error:', err));
  });
}

// Auto-recover from Vite dynamic import chunk mismatch when a new deployment occurs
if (typeof window !== 'undefined') {
  const handleChunkMismatch = () => {
    const reloadKey = 'lumixora_chunk_reload_lock';
    const lastReload = sessionStorage.getItem(reloadKey);
    const now = Date.now();
    if (!lastReload || (now - parseInt(lastReload, 10)) > 15000) {
      sessionStorage.setItem(reloadKey, now.toString());
      console.warn('[Deployment Sync] Chunk mismatch detected. Auto-reloading with latest deployment...');
      window.location.reload();
    }
  };

  window.addEventListener('vite:preloadError', (event) => {
    event?.preventDefault?.();
    handleChunkMismatch();
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg = (reason?.message || (typeof reason === 'string' ? reason : '') || '').toLowerCase();
    if (msg.includes('failed to fetch dynamically imported module') || msg.includes('loading chunk')) {
      event?.preventDefault?.();
      handleChunkMismatch();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = (event?.message || '').toLowerCase();
    if (msg.includes('failed to fetch dynamically imported module') || msg.includes('loading chunk')) {
      event?.preventDefault?.();
      handleChunkMismatch();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
