import { createContext, useCallback, useContext, useState } from 'react';
import { login, register, logout as logoutSvc, getSession } from '../services/authService.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  const handleLogin = useCallback(async (email, password) => {
    const result = login(email, password);
    if (result.success) setSession(result.user);
    return result;
  }, []);

  const handleRegister = useCallback(async (name, email, password) => {
    const result = register(name, email, password);
    if (result.success) setSession(result.user);
    return result;
  }, []);

  const handleLogout = useCallback(() => {
    logoutSvc();
    setSession(null);
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        session,
        isAuthenticated: !!session,
        isDemo: session?.isDemo ?? false,
        handleLogin,
        handleRegister,
        handleLogout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
