import { useCountUp } from '../../hooks/useCountUp.js';

const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54

/**
 * Animated SVG progress ring.
 * @prop {number} value  0-100 percentage
 * @prop {number} size   SVG viewBox size (default 120)
 * @prop {string} color  Stroke colour (default var(--accent))
 * @prop {React.ReactNode} children  Centre content
 */
export function ProgressRing({ value = 0, size = 120, color = 'var(--accent)', children, className = '' }) {
  const animated = useCountUp(Math.min(100, value));
  const offset = CIRCUMFERENCE * (1 - animated / 100);

  return (
    <div className={`ring ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="ring__svg" aria-hidden="true">
        <circle className="ring__track" cx="60" cy="60" r="54" />
        <circle
          className="ring__value"
          cx="60" cy="60" r="54"
          stroke={color}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      {children && <div className="ring__center">{children}</div>}
    </div>
  );
}

/**
 * Animated horizontal progress bar.
 * @prop {number} value     0-100 percentage
 * @prop {string} label     Left label
 * @prop {string} sublabel  Right label (e.g. "82 / 110 g")
 * @prop {string} color     Fill colour
 */
export function ProgressBar({ value = 0, label, sublabel, color = 'var(--accent)', className = '' }) {
  const animated = useCountUp(Math.min(100, value));

  return (
    <div className={`bar ${className}`}>
      {(label || sublabel) && (
        <div className="bar__meta">
          {label && <span>{label}</span>}
          {sublabel && <span className="text-3">{sublabel}</span>}
        </div>
      )}
      <div className="bar__track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="bar__fill"
          style={{ width: `${animated}%`, background: color }}
        />
      </div>
    </div>
  );
}
