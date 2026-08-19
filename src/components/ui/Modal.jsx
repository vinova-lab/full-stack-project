import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Accessible modal dialog.
 * Traps focus, closes on Escape, backdrop click optional.
 */
export default function Modal({ open, onClose, title, children, backdropClose = true, className = '' }) {
  const dialogRef = useRef(null);

  // Focus trap + Escape handler
  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    if (!el) return;

    // Auto-focus first focusable child
    const focusable = el.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable[0]) focusable[0].focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'Tab') {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={backdropClose ? onClose : undefined}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            ref={dialogRef}
            className={`modal ${className}`}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="modal__head">
                <span className="modal__title">{title}</span>
                <button className="icon-btn" onClick={onClose} aria-label="Close modal">✕</button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
