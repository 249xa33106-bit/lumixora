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
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('Vite preloadError detected. Auto-reloading latest deployment assets...');
    window.location.reload();
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
