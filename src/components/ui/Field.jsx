import { useState } from 'react';

/** Text/number/email/password input with optional icon and validation */
export function Field({ label, id, error, hint, icon, type = 'text', className = '', ...props }) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPw ? 'text' : 'password') : type;

  return (
    <div className={`field ${error ? 'invalid' : ''} ${icon ? 'field--icon' : ''} ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} type={inputType} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...props} />
      {icon && <span className="field__icon" aria-hidden="true">{icon}</span>}
      {isPassword && (
        <button type="button" className="field__eye" tabIndex={-1} onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}>
          {showPw ? '🙈' : '👁'}
        </button>
      )}
      {error && <span className="field__error" id={`${id}-err`} role="alert">{error}</span>}
      {hint && !error && <span className="field__hint">{hint}</span>}
    </div>
  );
}

/** Styled <select> */
export function Select({ label, id, options = [], className = '', ...props }) {
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <select id={id} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/** Toggle switch */
export function Switch({ label, checked, onChange, id }) {
  return (
    <label className="switch-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        className={`switch ${checked ? 'on' : ''}`}
        onClick={() => onChange?.(!checked)}
        type="button"
      />
      {label && <span>{label}</span>}
    </label>
  );
}

/** Segmented control */
export function Segmented({ options = [], value, onChange, className = '' }) {
  return (
    <div className={`segmented ${className}`} role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`segmented__btn ${value === o.value ? 'active' : ''}`}
          onClick={() => onChange?.(o.value)}
          aria-pressed={value === o.value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Option grid (like activity level selector) */
export function OptionGrid({ options = [], value, onChange, columns = 2 }) {
  return (
    <div className="option-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`option-card ${value === o.value ? 'selected' : ''}`}
          onClick={() => onChange?.(o.value)}
        >
          {o.emoji && <span style={{ fontSize: '1.5rem' }}>{o.emoji}</span>}
          <span>{o.label}</span>
          {o.desc && <small style={{ color: 'var(--text-3)', fontSize: '0.72rem' }}>{o.desc}</small>}
        </button>
      ))}
    </div>
  );
}
