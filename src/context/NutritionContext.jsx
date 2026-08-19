import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { todayKey } from '../utils/dates.js';
import {
  loadDayLog, saveDayLog,
  addMeal, updateMeal, removeMeal, toggleMeal,
} from '../services/dayService.js';

const NutritionCtx = createContext(null);

/** Sum macros of all meals marked done */
function sumConsumed(meals = []) {
  return meals
    .filter((m) => m.done)
    .reduce(
      (acc, m) => ({
        calories: acc.calories + (m.kcal ?? 0),
        protein: acc.protein + (m.p ?? 0),
        carbs: acc.carbs + (m.c ?? 0),
        fat: acc.fat + (m.f ?? 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
}

export function NutritionProvider({ children, isDemo }) {
  const [dateKey, setDateKey] = useState(todayKey);
  const [log, setLog] = useState(() => loadDayLog(todayKey(), isDemo));

  // Daily rollover check
  useEffect(() => {
    function check() {
      const today = todayKey();
      if (today !== dateKey) {
        setDateKey(today);
        setLog(loadDayLog(today, isDemo));
      }
    }
    const id = setInterval(check, 60_000);
    check();
    return () => clearInterval(id);
  }, [dateKey, isDemo]);

  function refresh(newLog) {
    setLog({ ...newLog });
  }

  // ─── Meals ──────────────────────────────────────────────────────────────────

  const logMeal = useCallback((meal) => {
    refresh(addMeal(dateKey, meal, isDemo));
  }, [dateKey, isDemo]);

  const editMeal = useCallback((mealId, updates) => {
    refresh(updateMeal(dateKey, mealId, updates, isDemo));
  }, [dateKey, isDemo]);

  const deleteMeal = useCallback((mealId) => {
    refresh(removeMeal(dateKey, mealId, isDemo));
  }, [dateKey, isDemo]);

  const checkMeal = useCallback((mealId) => {
    refresh(toggleMeal(dateKey, mealId, isDemo));
  }, [dateKey, isDemo]);

  // ─── Water ──────────────────────────────────────────────────────────────────

  const addWater = useCallback((ml) => {
    const updated = { ...log, waterMl: Math.max(0, (log.waterMl ?? 0) + ml) };
    saveDayLog(updated);
    refresh(updated);
  }, [log]);

  const setWater = useCallback((ml) => {
    const updated = { ...log, waterMl: Math.max(0, ml) };
    saveDayLog(updated);
    refresh(updated);
  }, [log]);

  // ─── Workout ────────────────────────────────────────────────────────────────

  const logWorkout = useCallback((min) => {
    const updated = { ...log, workoutMin: (log.workoutMin ?? 0) + min, workoutDone: true };
    saveDayLog(updated);
    refresh(updated);
  }, [log]);

  // ─── Sleep ──────────────────────────────────────────────────────────────────

  const logSleep = useCallback((min) => {
    const updated = { ...log, sleepMin: min };
    saveDayLog(updated);
    refresh(updated);
  }, [log]);

  // ─── Celebration tracker ─────────────────────────────────────────────────────

  const markCelebrated = useCallback((key) => {
    const updated = { ...log, celebrated: { ...(log.celebrated ?? {}), [key]: true } };
    saveDayLog(updated);
    refresh(updated);
  }, [log]);

  const consumed = sumConsumed(log.meals);

  return (
    <NutritionCtx.Provider value={{
      dateKey,
      log,
      meals: log.meals ?? [],
      waterMl: log.waterMl ?? 0,
      workoutMin: log.workoutMin ?? 0,
      workoutDone: log.workoutDone ?? false,
      sleepMin: log.sleepMin ?? 0,
      celebrated: log.celebrated ?? {},
      consumed,
      logMeal, editMeal, deleteMeal, checkMeal,
      addWater, setWater,
      logWorkout,
      logSleep,
      markCelebrated,
    }}>
      {children}
    </NutritionCtx.Provider>
  );
}

export function useNutrition() {
  const ctx = useContext(NutritionCtx);
  if (!ctx) throw new Error('useNutrition must be used within NutritionProvider');
  return ctx;
}
