import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fireConfetti } from '../utils/confetti.js';
import { playChime } from '../utils/sound.js';
import { useSettings } from '../context/SettingsContext.jsx';

export default function CelebrationOverlay({ goal, onDismiss }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (!goal) return;
    fireConfetti();
    playChime(settings.sound);
  }, [goal, settings.sound]);

  return (
    <AnimatePresence>
      {goal && (
        <motion.div
          className="celebrate-pop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          role="dialog"
          aria-modal="true"
          aria-label="Goal achieved"
        >
          <motion.div
            className="celebrate-card"
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', display: 'grid', placeItems: 'center', marginBottom: '0.5rem' }}>
              <div className="celebrate-ring" aria-hidden="true" />
              <div style={{ fontSize: '3rem', position: 'relative', zIndex: 1 }} aria-hidden="true">🏆</div>
            </div>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem' }}>Goal Achieved!</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: '0.5rem' }}>
              You completed your <strong>{goal}</strong> today! 🎉
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginBottom: '1.5rem', maxWidth: '28ch', textAlign: 'center' }}>
              Every completed goal compounds into the person you're becoming.
            </p>
            <button className="btn btn--primary" onClick={onDismiss}>
              Keep going 🚀
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
