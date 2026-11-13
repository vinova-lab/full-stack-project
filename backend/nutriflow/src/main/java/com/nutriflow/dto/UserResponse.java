package com.nutriflow.dto;

import com.nutriflow.domain.User;

/** Public view of a user - never exposes the password hash. */
public record UserResponse(
        Long id,
        String name,
        String email,
        boolean isDemo,
        Integer age,
        Double heightCm,
        Double weightKg,
        String goal,
        String activityLevel,
        String dietPreference,
        Integer waterGoalMl,
        Integer sleepGoalMin) {

    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.isDemo(), u.getAge(),
                u.getHeightCm(), u.getWeightKg(), u.getGoal(), u.getActivityLevel(),
                u.getDietPreference(), u.getWaterGoalMl(), u.getSleepGoalMin());
    }
}
