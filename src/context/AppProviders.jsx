import { ToastProvider } from './ToastContext.jsx';
import { SettingsProvider } from './SettingsContext.jsx';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import { UserProvider } from './UserContext.jsx';
import { NutritionProvider } from './NutritionContext.jsx';
import { HealthProvider } from './HealthContext.jsx';
import { GoalProvider } from './GoalContext.jsx';

/**
 * Inner providers that need auth context to know isDemo.
 */
function InnerProviders({ children }) {
  const { isDemo } = useAuth();
  return (
    <UserProvider isDemo={isDemo}>
      <NutritionProvider isDemo={isDemo}>
        <HealthProvider>
          <GoalProvider>
            {children}
          </GoalProvider>
        </HealthProvider>
      </NutritionProvider>
    </UserProvider>
  );
}

/**
 * Global provider tree — order matters:
 * Toast → Settings → Auth → User → Nutrition → Health → Goal
 */
export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <SettingsProvider>
        <AuthProvider>
          <InnerProviders>
            {children}
          </InnerProviders>
        </AuthProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}
