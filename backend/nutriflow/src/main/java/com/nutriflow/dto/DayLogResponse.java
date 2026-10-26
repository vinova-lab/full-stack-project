package com.nutriflow.dto;

import java.util.List;

/** Matches the frontend DayLog object plus server-computed totals and wellness score. */
public record DayLogResponse(
        Long id,
        String dateKey,
        List<MealResponse> meals,
        int waterMl,
        int workoutMin,
        boolean workoutDone,
        int sleepMin,
        IntakeTotals consumed,
        WellnessResponse wellness) {
}
