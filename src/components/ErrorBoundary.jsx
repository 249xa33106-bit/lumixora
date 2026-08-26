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
  }

  render() {
    if (this.state.hasError) {
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
              window.location.href = '/?refresh=' + Date.now();
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
