package com.nutriflow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

/** All fields optional; only non-null values are applied. */
public record ProfileUpdateRequest(
        String name,
        @Min(10) @Max(120) Integer age,
        @Min(80) @Max(260) Double heightCm,
        @Min(25) @Max(400) Double weightKg,
        @Pattern(regexp = "lose|maintain|gain|build") String goal,
        @Pattern(regexp = "sedentary|light|moderate|active|very_active") String activityLevel,
        String dietPreference,
        @Min(500) @Max(10000) Integer waterGoalMl,
        @Min(180) @Max(840) Integer sleepGoalMin) {
}
