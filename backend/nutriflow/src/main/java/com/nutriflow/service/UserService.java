package com.nutriflow.service;

import com.nutriflow.domain.User;
import com.nutriflow.dto.GoalsResponse;
import com.nutriflow.dto.ProfileUpdateRequest;
import com.nutriflow.dto.UserResponse;
import com.nutriflow.repository.UserRepository;
import com.nutriflow.service.calc.GoalCalculator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** BUSINESS LAYER - profile maintenance and goal derivation. */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse profile(User user) {
        return UserResponse.from(user);
    }

    /** Partial update - only non-null fields in the request are applied. */
    @Transactional
    public UserResponse updateProfile(User user, ProfileUpdateRequest req) {
        if (req.name() != null && !req.name().isBlank()) user.setName(req.name().trim());
        if (req.age() != null) user.setAge(req.age());
        if (req.heightCm() != null) user.setHeightCm(req.heightCm());
        if (req.weightKg() != null) user.setWeightKg(req.weightKg());
        if (req.goal() != null) user.setGoal(req.goal());
        if (req.activityLevel() != null) user.setActivityLevel(req.activityLevel());
        if (req.dietPreference() != null) user.setDietPreference(req.dietPreference());
        if (req.waterGoalMl() != null) user.setWaterGoalMl(req.waterGoalMl());
        if (req.sleepGoalMin() != null) user.setSleepGoalMin(req.sleepGoalMin());
        return UserResponse.from(userRepository.save(user));
    }

    /** BUSINESS RULE #2 applied to a concrete user (see GoalCalculator). */
    @Transactional(readOnly = true)
    public GoalsResponse goals(User user) {
        return GoalCalculator.goals(user.getWeightKg(), user.getHeightCm(), user.getAge(),
                user.getActivityLevel(), user.getGoal(), user.getWaterGoalMl(), user.getSleepGoalMin());
    }
}
