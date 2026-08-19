import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { get, set, remove, KEYS } from '../services/storage.js';

const SettingsCtx = createContext(null);

const DEFAULTS = {
  theme: 'dark',        // 'dark' | 'light' | 'system'
  motion: 'full',       // 'full' | 'reduced'
  sound: true,
  notifications: true,
  units: 'metric',      // 'metric' | 'imperial'
};

function resolveTheme(setting) {
  if (setting === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return setting;
}

function applyToDOM(settings) {
  const resolved = resolveTheme(settings.theme);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.motion = settings.motion;
}

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = useState(() => {
    const saved = get(KEYS.SETTINGS);
    return { ...DEFAULTS, ...(saved ?? {}) };
  });

  // Apply to DOM on every settings change
  useEffect(() => {
    applyToDOM(settings);
  }, [settings]);

  // React to OS dark-mode toggle when 'system' is selected
  useEffect(() => {
    if (settings.theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyToDOM(settings);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [settings]);

  const updateSettings = useCallback((patch) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      set(KEYS.SETTINGS, next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    remove(KEYS.SETTINGS);
    setSettingsState(DEFAULTS);
  }, []);

  return (
    <SettingsCtx.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsCtx.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsCtx);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
