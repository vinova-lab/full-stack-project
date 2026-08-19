import { createContext, useContext } from 'react';
import { useUser } from './UserContext.jsx';
import { useNutrition } from './NutritionContext.jsx';
import { bmiValue, bmiInfo } from '../utils/calculations.js';

const HealthCtx = createContext(null);

/**
 * Provides derived health metrics for the Health Metrics page.
 * Heart rate and blood pressure are demo values (future: wearable API).
 */
export function HealthProvider({ children }) {
  const { profile } = useUser();
  const { sleepMin } = useNutrition();

  const bmi = bmiValue(profile?.weightKg, profile?.heightCm);
  const bmiCategory = bmiInfo(bmi);

  // Demo static metrics — documented REST seam: GET /api/health/metrics
  const heartRate = 76; // bpm
  const hrTrend = [72, 74, 76, 73, 78, 75, 76]; // last 7 days
  const systolic = 118;
  const diastolic = 76;

  // Sleep derived from nutrition context (user logs sleep there)
  const sleepH = sleepMin ? Math.floor(sleepMin / 60) : 7;
  const sleepM = sleepMin ? sleepMin % 60 : 42;

  return (
    <HealthCtx.Provider value={{
      bmi,
      bmiCategory,
      heartRate,
      hrTrend,
      systolic,
      diastolic,
      sleepMin,
      sleepH,
      sleepM,
      sleepGoalMin: profile?.sleepGoalMin ?? 480,
    }}>
      {children}
    </HealthCtx.Provider>
  );
}

export function useHealth() {
  const ctx = useContext(HealthCtx);
  if (!ctx) throw new Error('useHealth must be used within HealthProvider');
  return ctx;
}
