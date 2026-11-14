import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = Math.random().toString(36).substring(2, 9) + Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl animate-fade-in-up backdrop-blur-md bg-slate-900/95 text-white ${
              toast.type === 'success' ? 'border-emerald-500/60 text-emerald-400' :
              toast.type === 'error' ? 'border-rose-500/60 text-rose-400' :
              toast.type === 'warning' ? 'border-amber-500/60 text-amber-400' :
              'border-blue-500/60 text-blue-400'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0 text-blue-400" />}
            
            <span className="text-xs md:text-sm font-semibold text-white tracking-wide">{toast.message}</span>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: ({ message, type }) => {
        console.log(`[Toast] (${type || 'info'}):`, message);
      }
    };
  }
  return context;
}
