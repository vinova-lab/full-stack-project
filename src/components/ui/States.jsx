/** Skeleton shimmer block */
export function Skeleton({ style, className = '' }) {
  return <div className={`shimmer ${className}`} style={style} aria-hidden="true" />;
}

/** Full-card loading state */
export function Loading({ message = 'Loading…', rows = 3 }) {
  return (
    <div className="state state--loading" aria-live="polite" aria-label={message}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} style={{ height: '1rem', width: `${70 + (i % 3) * 10}%`, marginBottom: '0.5rem' }} />
      ))}
      <span className="sr-only">{message}</span>
    </div>
  );
}

/** Empty state with emoji and CTA */
export function Empty({ emoji = '📭', title = 'Nothing here yet', message, action }) {
  return (
    <div className="state state--empty">
      <span className="state__icon" aria-hidden="true">{emoji}</span>
      <strong className="state__title">{title}</strong>
      {message && <p className="state__msg">{message}</p>}
      {action && <div style={{ marginTop: '1rem' }}>{action}</div>}
    </div>
  );
}

/** Error state with retry */
export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__icon" aria-hidden="true">⚠️</span>
      <strong className="state__title">Error</strong>
      <p className="state__msg">{message}</p>
      {onRetry && (
        <button className="btn btn--outline btn--sm" onClick={onRetry} style={{ marginTop: '0.75rem' }}>
          Try Again
        </button>
      )}
    </div>
  );
}
