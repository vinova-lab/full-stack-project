package com.nutriflow.repository;

import com.nutriflow.domain.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MealRepository extends JpaRepository<Meal, Long> {

    /** Derived query through the association: meal.dayLog.id */
    List<Meal> findByDayLog_Id(Long dayLogId);

    Optional<Meal> findByIdAndDayLog_Id(Long id, Long dayLogId);
}
