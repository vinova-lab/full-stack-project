import { forwardRef } from 'react';

/**
 * Button component.
 * @prop {'primary'|'ghost'|'outline'|'danger'} variant
 * @prop {'sm'|'md'|'lg'} size
 * @prop {boolean} loading  Shows spinner and disables interaction
 * @prop {boolean} block    Full-width
 */
const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, block = false, className = '', children, disabled, ...props },
  ref
) {
  const cls = [
    'btn',
    variant !== 'primary' ? `btn--${variant}` : '',
    size === 'sm' ? 'btn--sm' : size === 'lg' ? 'btn--lg' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} className={cls} disabled={disabled || loading} aria-busy={loading} {...props}>
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
});

export default Button;
