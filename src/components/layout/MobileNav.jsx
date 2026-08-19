import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/app/dashboard', icon: '🏠', label: 'Home' },
  { to: '/app/nutrition', icon: '🥗', label: 'Food' },
  { to: '/app/scanner', icon: '📷', label: 'Scan', isFab: true },
  { to: '/app/health', icon: '❤️', label: 'Health' },
  { to: '/app/goals', icon: '🎯', label: 'Goals' },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ to, icon, label, isFab }) =>
        isFab ? (
          <NavLink key={to} to={to} aria-label={label} className="mobile-nav__item">
            <div className="mobile-nav__scan" aria-hidden="true">{icon}</div>
            <span className="sr-only">{label}</span>
          </NavLink>
        ) : (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `mobile-nav__item${isActive ? ' active' : ''}`}
          >
            <span style={{ fontSize: '1.3rem', lineHeight: 1 }} aria-hidden="true">{icon}</span>
            <span className="mobile-nav__label">{label}</span>
          </NavLink>
        )
      )}
    </nav>
  );
}
