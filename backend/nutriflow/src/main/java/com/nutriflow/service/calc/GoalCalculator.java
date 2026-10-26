package com.nutriflow.service.calc;

import com.nutriflow.dto.GoalsResponse;

import java.util.Map;

/**
 * BUSINESS RULE #2 - Daily calorie target and macro split.
 * Port of src/utils/calculations.js (calcCalorieTarget + calcMacros) so the server and
 * the React app agree on the numbers.
 *
 * <pre>
 *   BMR  = 10*weightKg + 6.25*heightCm - 5*age - 78   (gender-neutral Mifflin-St Jeor midpoint)
 *   TDEE = BMR * activityFactor
 *   kcal = round( TDEE * (1 + goalOffset) / 50 ) * 50
 * </pre>
 */
public final class GoalCalculator {

    public static final int DEFAULT_WATER_GOAL_ML = 2500;
    public static final int DEFAULT_WORKOUT_GOAL_MIN = 30;
    public static final int DEFAULT_SLEEP_GOAL_MIN = 480;

    private static final Map<String, Double> ACTIVITY_FACTORS = Map.of(
            "sedentary", 1.2,
            "light", 1.375,
            "moderate", 1.55,
            "active", 1.725,
            "very_active", 1.9);

    private static final Map<String, Double> GOAL_OFFSETS = Map.of(
            "lose", -0.15,
            "maintain", 0.0,
            "gain", 0.12,
            "build", 0.18);

    private GoalCalculator() {
    }

    public static int calorieTarget(Double weightKg, Double heightCm, Integer age,
                                    String activityLevel, String goal) {
        double w = weightKg == null ? 70 : weightKg;
        double h = heightCm == null ? 170 : heightCm;
        int a = age == null ? 25 : age;

        double bmr = 10 * w + 6.25 * h - 5 * a - 78;
        double tdee = bmr * ACTIVITY_FACTORS.getOrDefault(activityLevel == null ? "" : activityLevel, 1.55);
        double adjusted = tdee * (1 + GOAL_OFFSETS.getOrDefault(goal == null ? "" : goal, 0.0));
        return (int) Math.round(adjusted / 50.0) * 50;
    }

    /** protein 25-30 %, fat 28 %, carbs the remainder. 4 kcal/g protein & carbs, 9 kcal/g fat. */
    public static int[] macros(int calories, String goal) {
        boolean highProtein = "build".equals(goal) || "lose".equals(goal);
        double proteinPct = highProtein ? 0.30 : 0.25;
        double fatPct = 0.28;
        double carbPct = 1 - proteinPct - fatPct;
        return new int[]{
                (int) Math.round(calories * proteinPct / 4),
                (int) Math.round(calories * carbPct / 4),
                (int) Math.round(calories * fatPct / 9)
        };
    }

    public static GoalsResponse goals(Double weightKg, Double heightCm, Integer age,
                                      String activityLevel, String goal,
                                      Integer waterGoalMl, Integer sleepGoalMin) {
        int calories = calorieTarget(weightKg, heightCm, age, activityLevel, goal);
        int[] m = macros(calories, goal);
        return new GoalsResponse(
                calories, m[0], m[1], m[2],
                waterGoalMl == null ? DEFAULT_WATER_GOAL_ML : waterGoalMl,
                DEFAULT_WORKOUT_GOAL_MIN,
                sleepGoalMin == null ? DEFAULT_SLEEP_GOAL_MIN : sleepGoalMin);
    }
}
