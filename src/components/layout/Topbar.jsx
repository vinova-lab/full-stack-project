import { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGoal } from '../../context/GoalContext.jsx';
import { useNutrition } from '../../context/NutritionContext.jsx';

const ROUTE_TITLES = {
  '/app/dashboard': '🏠 Dashboard',
  '/app/nutrition': '🥗 Nutrition',
  '/app/scanner': '📷 Food Scanner',
  '/app/health': '❤️ Health Metrics',
  '/app/water': '💧 Water Tracker',
  '/app/workout': '🏋️ Workout',
  '/app/plans': '📋 Diet Plans',
  '/app/plan-builder': '✨ Plan Builder',
  '/app/goals': '🎯 Goals',
  '/app/analytics': '📈 Analytics',
  '/app/achievements': '🏆 Achievements',
  '/app/profile': '👤 Profile',
  '/app/settings': '⚙️ Settings',
  '/app/contact': '💬 Help & Contact',
};

export default function Topbar({ onMenuToggle }) {
  const { session, handleLogout } = useAuth();
  const { score, streak } = useGoal();
  const { waterMl } = useNutrition();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const title = ROUTE_TITLES[location.pathname] ?? 'NutriFlow';

  // Close menus when clicking outside
  function handleBlur(setter) {
    return () => setTimeout(() => setter(false), 150);
  }

  const notifications = [];
  if (streak >= 7) notifications.push({ id: 'streak', text: `🔥 ${streak}-day streak — keep it going!` });
  if (waterMl < 1000) notifications.push({ id: 'water', text: '💧 Under 1L today — drink more water.' });
  if (score < 40) notifications.push({ id: 'score', text: '📊 Wellness score is low — check your goals.' });

  function logout() {
    handleLogout();
    navigate('/login');
  }

  return (
    <header className="topbar" role="banner">
      {/* Mobile hamburger — hidden on desktop via CSS */}
      <button
        className="icon-btn"
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
        style={{ display: 'none' }} /* hidden; sidebar is always visible on desktop */
      >
        ☰
      </button>

      {/* Page title */}
      <h1 className="topbar__title" style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 700, flex: 1 }}>
        {title}
      </h1>

      <div className="topbar__actions">
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-btn"
            onClick={() => setNotifOpen((o) => !o)}
            onBlur={handleBlur(setNotifOpen)}
            aria-label={`Notifications${notifications.length ? ` (${notifications.length})` : ''}`}
            aria-expanded={notifOpen}
            aria-haspopup="menu"
          >
            🔔
            {notifications.length > 0 && <span className="dot" aria-hidden="true" />}
          </button>

          {notifOpen && (
            <div className="menu-pop" role="menu" aria-label="Notifications">
              <div style={{ padding: '0.5rem 1rem 0.25rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                Notifications
              </div>
              {notifications.length === 0 ? (
                <div className="notif-row" style={{ color: 'var(--text-3)', fontSize: '0.84rem' }}>All caught up! 🎉</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="notif-row" role="menuitem">
                    <p style={{ margin: 0, fontSize: '0.84rem' }}>{n.text}</p>
                  </div>
                ))
              )}
              <div className="divider" />
              <button className="menu-pop__item" role="menuitem" onClick={() => setNotifOpen(false)} style={{ width: '100%' }}>
                Dismiss all
              </button>
            </div>
          )}
        </div>

        {/* Avatar menu */}
        <div style={{ position: 'relative' }}>
          <button
            className="avatar"
            onClick={() => setAvatarOpen((o) => !o)}
            onBlur={handleBlur(setAvatarOpen)}
            aria-label="Account menu"
            aria-expanded={avatarOpen}
            aria-haspopup="menu"
          >
            {session?.name?.[0]?.toUpperCase() ?? 'U'}
          </button>

          {avatarOpen && (
            <div className="menu-pop" role="menu" aria-label="Account">
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{session?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>{session?.email}</div>
              </div>
              <button role="menuitem" className="menu-pop__item" onClick={() => { navigate('/app/profile'); setAvatarOpen(false); }}>
                👤 Profile
              </button>
              <button role="menuitem" className="menu-pop__item" onClick={() => { navigate('/app/settings'); setAvatarOpen(false); }}>
                ⚙️ Settings
              </button>
              <div className="divider" />
              <button role="menuitem" className="menu-pop__item danger" onClick={logout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
