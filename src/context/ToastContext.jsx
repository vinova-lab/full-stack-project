import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastCtx = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message, { type = 'info', duration = 3500 } = {}) => {
      const id = ++_id;
      setToasts((t) => [...t.slice(-4), { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const success = useCallback((msg, opts) => toast(msg, { ...opts, type: 'success' }), [toast]);
  const error = useCallback((msg, opts) => toast(msg, { ...opts, type: 'error' }), [toast]);
  const info = useCallback((msg, opts) => toast(msg, { ...opts, type: 'info' }), [toast]);

  return (
    <ToastCtx.Provider value={{ toast, success, error, info, dismiss }}>
      {children}
      {/* Toast viewport */}
      <div className="toast-viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`} role="alert">
            <span className="toast__msg">{t.message}</span>
            <button className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss">✕</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
