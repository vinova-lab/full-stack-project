import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNutrition } from './NutritionContext.jsx';
import { useUser } from './UserContext.jsx';
import { clampPct, wellnessScore } from '../utils/calculations.js';
import { calcStreak } from '../utils/history.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { get, set, KEYS } from '../services/storage.js';

const GoalCtx = createContext(null);

export function GoalProvider({ children }) {
  const { goals } = useUser();
  const { consumed, waterMl, workoutMin, sleepMin, celebrated, markCelebrated } = useNutrition();

  // ─── Progress percentages ──────────────────────────────────────────────────

  const progress = {
    calories: clampPct((consumed.calories / (goals?.calories ?? 1850)) * 100),
    protein: clampPct((consumed.protein / (goals?.proteinG ?? 110)) * 100),
    carbs: clampPct((consumed.carbs / (goals?.carbsG ?? 228)) * 100),
    fat: clampPct((consumed.fat / (goals?.fatG ?? 58)) * 100),
    water: clampPct((waterMl / (goals?.waterMl ?? 2500)) * 100),
    workout: clampPct((workoutMin / (goals?.workoutMin ?? 30)) * 100),
    sleep: clampPct((sleepMin / (goals?.sleepMin ?? 480)) * 100),
  };

  const { score, breakdown } = wellnessScore({
    caloriesConsumed: consumed.calories,
    caloriesTarget: goals?.calories ?? 1850,
    waterMl,
    waterGoalMl: goals?.waterMl ?? 2500,
    workoutMin,
    workoutGoalMin: goals?.workoutMin ?? 30,
    sleepMin,
    sleepGoalMin: goals?.sleepMin ?? 480,
  });

  // ─── Streak ────────────────────────────────────────────────────────────────

  const [streak, setStreak] = useState(() => calcStreak());

  useEffect(() => {
    setStreak(calcStreak());
  }, [score]);

  // ─── Achievements ──────────────────────────────────────────────────────────

  const [unlockedIds, setUnlockedIds] = useState(() => {
    const saved = get(KEYS.ACHIEVEMENTS);
    return saved ?? [];
  });

  const achievementStats = {
    streak,
    totalDays: streak, // simplification — full history walk for real data
    hydrationDays: progress.water >= 100 ? 7 : Math.floor(progress.water / 14),
    workoutDays: Math.floor(streak * 0.6),
    nutritionDays: streak >= 14 ? 14 : streak,
  };

  useEffect(() => {
    const newIds = ACHIEVEMENTS
      .filter((a) => !unlockedIds.includes(a.id) && a.check(achievementStats))
      .map((a) => a.id);

    if (newIds.length > 0) {
      const next = [...unlockedIds, ...newIds];
      set(KEYS.ACHIEVEMENTS, next);
      setUnlockedIds(next);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak]);

  // ─── Celebration ───────────────────────────────────────────────────────────

  const [celebrationGoal, setCelebrationGoal] = useState(null);
  const prevScore = useRef(score);

  useEffect(() => {
    const prev = prevScore.current;
    prevScore.current = score;

    // Trigger celebration once when crossing 100% for goals (not repeated same day)
    const checks = [
      { key: 'calories', pct: progress.calories, label: 'Calorie Goal' },
      { key: 'water', pct: progress.water, label: 'Hydration Goal' },
      { key: 'workout', pct: progress.workout, label: 'Workout Goal' },
      { key: 'wellness', pct: score, label: 'Wellness Score' },
    ];

    for (const { key, pct, label } of checks) {
      if (pct >= 100 && !celebrated?.[key]) {
        markCelebrated(key);
        setCelebrationGoal(label);
        return;
      }
    }
  }, [progress.calories, progress.water, progress.workout, score]);

  const dismissCelebration = useCallback(() => setCelebrationGoal(null), []);

  return (
    <GoalCtx.Provider value={{
      goals,
      progress,
      score,
      breakdown,
      streak,
      unlockedIds,
      achievementStats,
      celebrationGoal,
      dismissCelebration,
    }}>
      {children}
    </GoalCtx.Provider>
  );
}

export function useGoal() {
  const ctx = useContext(GoalCtx);
  if (!ctx) throw new Error('useGoal must be used within GoalProvider');
  return ctx;
}
