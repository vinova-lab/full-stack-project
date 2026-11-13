package com.nutriflow.dto;

/** Matches frontend DEMO_GOALS shape: calories, proteinG, carbsG, fatG, waterMl, workoutMin, sleepMin */
public record GoalsResponse(
        int calories,
        int proteinG,
        int carbsG,
        int fatG,
        int waterMl,
        int workoutMin,
        int sleepMin) {
}
