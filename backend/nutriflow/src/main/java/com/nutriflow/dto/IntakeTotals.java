package com.nutriflow.dto;

/** Sum of the COMPLETED meals in a day (business rule: planned meals do not count). */
public record IntakeTotals(int kcal, int proteinG, int carbsG, int fatG) {
}
