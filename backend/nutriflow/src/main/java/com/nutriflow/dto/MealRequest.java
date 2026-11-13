package com.nutriflow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Body for POST/PUT /api/log/{date}/meal. Field names match the frontend meal object
 * (p / c / f are protein, carbs, fat in grams). For PUT every field is optional.
 */
public record MealRequest(
        @Pattern(regexp = "breakfast|lunch|dinner|snack") String type,
        String name,
        @Pattern(regexp = "([01]\\d|2[0-3]):[0-5]\\d") String time,
        @Min(0) @Max(5000) Integer kcal,
        @Min(0) @Max(500) Integer p,
        @Min(0) @Max(1000) Integer c,
        @Min(0) @Max(500) Integer f,
        Boolean done) {
}
