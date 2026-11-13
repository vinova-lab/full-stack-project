import { motion } from 'framer-motion';

const VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Page wrapper: entrance fade-up + optional header.
 * title/subtitle render as h2/p above the main content slot.
 * actions renders right-aligned next to the heading.
 */
export default function Page({ title, subtitle, actions, children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={VARIANTS}
      initial="hidden"
      animate="visible"
    >
      {(title || actions) && (
        <div className="page-header">
          <div>
            {title && (
              <h2 style={{ fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)', fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1.2 }}>
                {title}
              </h2>
            )}
            {subtitle && <p style={{ marginTop: '0.35rem', fontSize: '0.875rem', color: 'var(--text-3)' }}>{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
