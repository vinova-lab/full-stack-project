import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useUser } from '../context/UserContext.jsx';

// Pages
import Landing from '../pages/Landing.jsx';
import { Login, Register } from '../pages/Auth.jsx';
import Onboarding from '../pages/Onboarding.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Health from '../pages/Health.jsx';
import Analytics from '../pages/Analytics.jsx';
import { Nutrition, Scanner, Water, Workout } from '../pages/NutritionPages.jsx';
import { DietPlans, PlanBuilder, Goals, Achievements } from '../pages/PlanPages.jsx';
import { Profile, Settings, Contact, NotFound } from '../pages/MiscPages.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';

/** Guard: redirect to login if not authenticated */
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

/** Guard: redirect new users to onboarding if no profile */
function RequireProfile({ children }) {
  const { hasProfile } = useUser();
  const { isDemo } = useAuth();
  if (!hasProfile && !isDemo) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />

      {/* Protected app shell */}
      <Route
        path="/app"
        element={
          <RequireAuth>
            <RequireProfile>
              <AppLayout />
            </RequireProfile>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="nutrition" element={<Nutrition />} />
        <Route path="scanner" element={<Scanner />} />
        <Route path="health" element={<Health />} />
        <Route path="water" element={<Water />} />
        <Route path="workout" element={<Workout />} />
        <Route path="plans" element={<DietPlans />} />
        <Route path="plan-builder" element={<PlanBuilder />} />
        <Route path="goals" element={<Goals />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
