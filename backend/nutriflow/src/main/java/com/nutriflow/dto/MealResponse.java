package com.nutriflow.dto;

import com.nutriflow.domain.Meal;

public record MealResponse(Long id, String type, String name, String time,
                           int kcal, int p, int c, int f, boolean done) {

    public static MealResponse from(Meal m) {
        return new MealResponse(m.getId(), m.getType(), m.getName(), m.getTime(),
                m.getKcal(), m.getProteinG(), m.getCarbsG(), m.getFatG(), m.isDone());
    }
}
