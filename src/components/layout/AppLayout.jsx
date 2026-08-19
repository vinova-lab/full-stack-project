import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AnimatedBackground from '../AnimatedBackground.jsx';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import MobileNav from './MobileNav.jsx';
import AIChat from '../ai/AIChat.jsx';
import CelebrationOverlay from '../CelebrationOverlay.jsx';
import { useGoal } from '../../context/GoalContext.jsx';

const SIDEBAR_KEY = 'nf_sidebar';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === 'true'; } catch { return false; }
  });
  const { celebrationGoal, dismissCelebration } = useGoal();

  function toggleSidebar() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  }

  return (
    <div className="app-shell" data-collapsed={collapsed}>
      <AnimatedBackground />

      {/* Desktop sidebar */}
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      {/* Right column: topbar + scrollable content */}
      <div className="app-right">
        <Topbar onMenuToggle={toggleSidebar} />
        <main className="app-main" id="main-content" tabIndex={-1}>
          <div className="app-content">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Floating AI chat */}
      <AIChat />

      {/* Goal celebration overlay */}
      <CelebrationOverlay goal={celebrationGoal} onDismiss={dismissCelebration} />
    </div>
  );
}
