package com.nutriflow.dto;

public record WellnessResponse(int score, Breakdown breakdown) {

    public record Breakdown(int nutrition, int hydration, int activity, int sleep) {
    }
}
