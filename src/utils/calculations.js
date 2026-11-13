/** Clamp value between 0-100 for percentage display */
export function clampPct(v) {
  return Math.max(0, Math.min(100, Math.round(v)));
}

// ─── BMI ─────────────────────────────────────────────────────────────────────

/** BMI value (rounded 1dp) from kg/cm */
export function bmiValue(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const hm = heightCm / 100;
  return Math.round((weightKg / (hm * hm)) * 10) / 10;
}

/**
 * Neutral BMI category info — avoids stigmatising language.
 * Returns { label, color, description, range }
 */
export function bmiInfo(bmi) {
  if (bmi === null) return null;
  if (bmi < 18.5)
    return { label: 'Below Average', color: 'var(--accent-3)', range: '< 18.5', description: 'Consider a nutrition check-in.' };
  if (bmi < 25)
    return { label: 'Average Range', color: 'var(--accent)', range: '18.5 – 24.9', description: 'Within the typical healthy range.' };
  if (bmi < 30)
    return { label: 'Above Average', color: 'var(--c-warn)', range: '25 – 29.9', description: 'A small lifestyle shift can help.' };
  return { label: 'High Range', color: 'var(--c-danger)', range: '≥ 30', description: 'Consulting a professional is advisable.' };
}

// ─── Calorie target ───────────────────────────────────────────────────────────

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_OFFSETS = {
  lose: -0.15,
  maintain: 0,
  gain: 0.12,
  build: 0.18,
};

/**
 * Gender-neutral Mifflin-St Jeor variant.
 * Returns daily calorie target in kcal (rounded to nearest 50).
 */
export function calcCalorieTarget(profile) {
  const { weightKg = 70, heightCm = 170, age = 25, activityLevel = 'moderate', goal = 'maintain' } = profile;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78; // gender-neutral midpoint
  const tdee = bmr * (ACTIVITY_FACTORS[activityLevel] ?? 1.55);
  const adjusted = tdee * (1 + (GOAL_OFFSETS[goal] ?? 0));
  return Math.round(adjusted / 50) * 50;
}

/** Macro split (g) from calorie target */
export function calcMacros(calories, goal = 'maintain') {
  // protein 25-30%, carbs 40-45%, fat 25-30%
  const highProtein = goal === 'build' || goal === 'lose';
  const proteinPct = highProtein ? 0.30 : 0.25;
  const fatPct = 0.28;
  const carbPct = 1 - proteinPct - fatPct;
  return {
    proteinG: Math.round((calories * proteinPct) / 4),
    carbsG: Math.round((calories * carbPct) / 4),
    fatG: Math.round((calories * fatPct) / 9),
  };
}

// ─── Wellness score ───────────────────────────────────────────────────────────

const WEIGHTS = { nutrition: 0.3, hydration: 0.25, activity: 0.25, sleep: 0.2 };

/**
 * Returns wellness score 0-100 and breakdown object.
 * @param {object} data { caloriesConsumed, caloriesTarget, waterMl, waterGoalMl, workoutMin, workoutGoalMin, sleepMin, sleepGoalMin }
 */
export function wellnessScore(data) {
  const {
    caloriesConsumed = 0, caloriesTarget = 1800,
    waterMl = 0, waterGoalMl = 2500,
    workoutMin = 0, workoutGoalMin = 30,
    sleepMin = 0, sleepGoalMin = 480,
  } = data;

  // Nutrition: scored on a bell curve — too low or too high both reduce score
  const calRatio = caloriesConsumed / (caloriesTarget || 1800);
  const nutritionRaw = calRatio <= 1
    ? calRatio * 100                             // approaching target: linear
    : Math.max(0, 100 - (calRatio - 1) * 200);  // over target: penalty

  const hydration = clampPct((waterMl / (waterGoalMl || 2500)) * 100);
  const activity = clampPct((workoutMin / (workoutGoalMin || 30)) * 100);
  const sleep = clampPct((sleepMin / (sleepGoalMin || 480)) * 100);
  const nutrition = clampPct(nutritionRaw);

  const score = Math.round(
    nutrition * WEIGHTS.nutrition +
    hydration * WEIGHTS.hydration +
    activity * WEIGHTS.activity +
    sleep * WEIGHTS.sleep
  );

  return { score, breakdown: { nutrition, hydration, activity, sleep } };
}
