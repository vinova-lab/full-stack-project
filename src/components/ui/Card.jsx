/**
 * Glass card surface.
 * @prop {boolean} hover  Add hover lift effect
 * @prop {boolean} glow   Add emerald glow border
 * @prop {string} title   Optional card title (renders .card__head)
 * @prop {string} subtitle
 */
export default function Card({ children, hover, glow, title, subtitle, className = '', style, ...props }) {
  const cls = ['card', hover && 'card--hover', glow && 'card--glow', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={style} {...props}>
      {(title || subtitle) && (
        <div className="card__head">
          {title && <span className="card__title">{title}</span>}
          {subtitle && <span className="card__sub">{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
