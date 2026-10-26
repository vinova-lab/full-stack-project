package com.nutriflow.service.calc;

import com.nutriflow.dto.WellnessResponse;

/**
 * BUSINESS RULE #3 - Wellness score (0-100), port of wellnessScore() in calculations.js.
 *
 * nutrition 30 % (bell curve: linear up to target, -200 %/unit penalty above target),
 * hydration 25 %, activity 25 %, sleep 20 %. Each component is clamped to 0-100.
 */
public final class WellnessCalculator {

    private WellnessCalculator() {
    }

    public static int clampPct(double v) {
        return (int) Math.max(0, Math.min(100, Math.round(v)));
    }

    public static WellnessResponse score(int caloriesConsumed, int caloriesTarget,
                                         int waterMl, int waterGoalMl,
                                         int workoutMin, int workoutGoalMin,
                                         int sleepMin, int sleepGoalMin) {
        double calRatio = caloriesConsumed / (double) (caloriesTarget > 0 ? caloriesTarget : 1800);
        double nutritionRaw = calRatio <= 1
                ? calRatio * 100
                : Math.max(0, 100 - (calRatio - 1) * 200);

        int nutrition = clampPct(nutritionRaw);
        int hydration = clampPct(waterMl * 100.0 / (waterGoalMl > 0 ? waterGoalMl : 2500));
        int activity = clampPct(workoutMin * 100.0 / (workoutGoalMin > 0 ? workoutGoalMin : 30));
        int sleep = clampPct(sleepMin * 100.0 / (sleepGoalMin > 0 ? sleepGoalMin : 480));

        int score = (int) Math.round(
                nutrition * 0.30 + hydration * 0.25 + activity * 0.25 + sleep * 0.20);

        return new WellnessResponse(score,
                new WellnessResponse.Breakdown(nutrition, hydration, activity, sleep));
    }
}
