import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });

    const errorStr = (
      (error?.message || '') + ' ' +
      (error?.stack || '') + ' ' +
      (error?.toString?.() || '')
    ).toLowerCase();
    const isChunkMismatch = 
      errorStr.includes('failed to fetch dynamically imported module') ||
      errorStr.includes('loading chunk') ||
      errorStr.includes('dynamically imported module') ||
      errorStr.includes('importing a module script failed') ||
      error?.name === 'ChunkLoadError';

    if (isChunkMismatch && typeof window !== 'undefined') {
      const reloadKey = 'lumixora_chunk_reload_lock';
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();
      if (!lastReload || (now - parseInt(lastReload, 10)) > 15000) {
        sessionStorage.setItem(reloadKey, now.toString());
        console.warn('Deployment chunk hash change detected. Auto-reloading page with new assets...');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const errorStr = (
        (this.state.error?.message || '') + ' ' +
        (this.state.error?.stack || '') + ' ' +
        (this.state.error?.toString?.() || '')
      ).toLowerCase();
      const isChunkMismatch = 
        errorStr.includes('failed to fetch dynamically imported module') ||
        errorStr.includes('loading chunk') ||
        errorStr.includes('dynamically imported module') ||
        errorStr.includes('importing a module script failed') ||
        this.state.error?.name === 'ChunkLoadError';

      if (isChunkMismatch) {
        return (
          <div style={{ padding: '3rem 2rem', color: '#fff', backgroundColor: '#070D1E', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ maxWidth: '480px', padding: '2rem', borderRadius: '16px', background: '#0B132B', border: '1px solid rgba(245, 158, 11, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#FBBF24' }}>Platform Updated</h2>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                A new version of Lumixora has just been deployed with the latest features. Click below to load the updated application.
              </p>
              <button
                onClick={() => {
                  sessionStorage.removeItem('lumixora_chunk_reload_done');
                  window.location.reload();
                }}
                style={{ width: '100%', padding: '0.75rem 1.5rem', background: 'linear-gradient(to right, #F59E0B, #FBBF24)', color: '#000', borderRadius: '10px', cursor: 'pointer', fontWeight: '900', border: 'none', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}
              >
                Reload Latest Version
              </button>
            </div>
          </div>
        );
      }
      return (
        <div style={{ padding: '2rem', color: '#ff4444', backgroundColor: '#1a1a1a', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#000', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '12px', marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Error Details:</div>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={async () => {
              try {
                localStorage.clear();
                sessionStorage.clear();
                if ('caches' in window) {
                  const names = await caches.keys();
                  await Promise.all(names.map(name => caches.delete(name)));
                }
                if ('serviceWorker' in navigator) {
                  const registrations = await navigator.serviceWorker.getRegistrations();
                  for (let registration of registrations) {
                    await registration.unregister();
                  }
                }
              } catch (e) {
                console.error(e);
              }
              // If stuck on an old immutable preview hash deployment, redirect to live production
              if (window.location.hostname.endsWith('.lumixora.pages.dev') && window.location.hostname !== 'lumixora.pages.dev') {
                window.location.href = 'https://lumixora.in/' + window.location.hash;
              } else {
                window.location.href = '/?refresh=' + Date.now() + window.location.hash;
              }
            }}
            style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear Data & Hard Restart
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
