import { createContext, useCallback, useContext, useState } from 'react';
import { get, set, KEYS } from '../services/storage.js';
import { DEMO_USER, DEMO_GOALS } from '../data/demoData.js';
import { calcCalorieTarget, calcMacros } from '../utils/calculations.js';

const UserCtx = createContext(null);

function loadProfile(isDemo) {
  if (isDemo) return DEMO_USER;
  return get(KEYS.USER) ?? null;
}

function loadGoals(isDemo, profile) {
  if (isDemo) return DEMO_GOALS;
  const saved = get(KEYS.GOALS);
  if (saved) return saved;
  if (profile) {
    const calories = calcCalorieTarget(profile);
    const macros = calcMacros(calories, profile.goal);
    return {
      calories,
      proteinG: macros.proteinG,
      carbsG: macros.carbsG,
      fatG: macros.fatG,
      waterMl: profile.waterGoalMl ?? 2500,
      workoutMin: 30,
      sleepMin: profile.sleepGoalMin ?? 480,
    };
  }
  return DEMO_GOALS;
}

export function UserProvider({ children, isDemo }) {
  const [profile, setProfile] = useState(() => loadProfile(isDemo));
  const [goals, setGoals] = useState(() => {
    const p = loadProfile(isDemo);
    return loadGoals(isDemo, p);
  });

  const saveProfile = useCallback((updates) => {
    setProfile((prev) => {
      const next = { ...(prev ?? {}), ...updates };
      if (!isDemo) set(KEYS.USER, next);
      return next;
    });
  }, [isDemo]);

  const saveGoals = useCallback((updates) => {
    setGoals((prev) => {
      const next = { ...(prev ?? {}), ...updates };
      if (!isDemo) set(KEYS.GOALS, next);
      return next;
    });
  }, [isDemo]);

  const completeOnboarding = useCallback((profileData) => {
    const calories = calcCalorieTarget(profileData);
    const macros = calcMacros(calories, profileData.goal);
    const newGoals = {
      calories,
      proteinG: macros.proteinG,
      carbsG: macros.carbsG,
      fatG: macros.fatG,
      waterMl: profileData.waterGoalMl ?? 2500,
      workoutMin: 30,
      sleepMin: profileData.sleepGoalMin ?? 480,
    };
    set(KEYS.USER, profileData);
    set(KEYS.GOALS, newGoals);
    setProfile(profileData);
    setGoals(newGoals);
  }, []);

  const hasProfile = !!profile;

  return (
    <UserCtx.Provider value={{ profile, goals, hasProfile, saveProfile, saveGoals, completeOnboarding }}>
      {children}
    </UserCtx.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
