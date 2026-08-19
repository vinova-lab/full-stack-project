import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const MAIN_NAV = [
  { to: '/app/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/app/nutrition', icon: '🥗', label: 'Nutrition' },
  { to: '/app/scanner', icon: '📷', label: 'Food Scanner' },
  { to: '/app/health', icon: '❤️', label: 'Health' },
  { to: '/app/workout', icon: '🏋️', label: 'Workout' },
  { to: '/app/plans', icon: '📋', label: 'Diet Plans' },
  { to: '/app/goals', icon: '🎯', label: 'Goals' },
  { to: '/app/profile', icon: '👤', label: 'Profile' },
];

const SUB_NAV = [
  { to: '/app/water', icon: '💧', label: 'Water' },
  { to: '/app/analytics', icon: '📈', label: 'Analytics' },
  { to: '/app/achievements', icon: '🏆', label: 'Achievements' },
  { to: '/app/plan-builder', icon: '✨', label: 'Plan Builder' },
  { to: '/app/settings', icon: '⚙️', label: 'Settings' },
  { to: '/app/contact', icon: '💬', label: 'Help' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { handleLogout, session } = useAuth();
  const navigate = useNavigate();

  function logout() {
    handleLogout();
    navigate('/login');
  }

  return (
    <aside
      className="sidebar"
      aria-label="Main navigation"
      style={{ width: collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)' }}
    >
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="brand-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
            <path d="M32 10c10 6 16 13 16 22 0 10-7 18-16 22-9-4-16-12-16-22 0-9 6-16 16-22z"
              fill="none" stroke="#04121a" strokeWidth="3.5" strokeLinejoin="round"/>
            <path d="M18 34h7l3-8 5 14 3-6h10" fill="none" stroke="#04121a"
              strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {!collapsed && <span className="brand-name">NutriFlow</span>}
      </div>

      {/* Main nav */}
      <nav className="sidebar__nav" aria-label="Main">
        {!collapsed && <div className="sidebar__label">Main</div>}
        {MAIN_NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title={collapsed ? label : undefined}
          >
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }} aria-hidden="true">{icon}</span>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {!collapsed && <div className="sidebar__label" style={{ marginTop: '6px' }}>More</div>}
        <div className="divider" style={{ margin: '6px 0' }} />

        {SUB_NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title={collapsed ? label : undefined}
          >
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }} aria-hidden="true">{icon}</span>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      {!collapsed && session && (
        <div style={{ padding: '12px 10px 0', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div className="avatar" style={{ width: 36, height: 36, borderRadius: '12px', fontSize: '0.9rem', flexShrink: 0 }}>
              {session.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.84rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.email}</div>
            </div>
          </div>
        </div>
      )}

      <button
        className="nav-item"
        onClick={logout}
        title={collapsed ? 'Logout' : undefined}
        style={{ border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'var(--danger)', marginTop: '4px' }}
      >
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }} aria-hidden="true">🚪</span>
        {!collapsed && <span>Logout</span>}
      </button>

      {/* Collapse toggle */}
      <button className="sidebar__collapse" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: 'transform 0.35s', transform: collapsed ? 'rotate(180deg)' : 'none' }}>
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
