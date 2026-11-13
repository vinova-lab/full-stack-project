package com.nutriflow.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.util.ArrayList;
import java.util.List;

/**
 * One user's log for one calendar day: meals, water, workout and sleep.
 * Mirrors the frontend's {@code DayLog} object in dayService.js.
 * One row per (user, date) is enforced by a unique constraint.
 */
@Entity
@Table(name = "day_logs",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "date_key"}))
public class DayLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** ISO date, e.g. 2026-10-27 */
    @Column(name = "date_key", nullable = false, length = 10)
    private String dateKey;

    private int waterMl;
    private int workoutMin;
    private boolean workoutDone;
    private int sleepMin;

    @OneToMany(mappedBy = "dayLog", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("time ASC, id ASC")
    private List<Meal> meals = new ArrayList<>();

    protected DayLog() {
        // required by JPA
    }

    public DayLog(Long userId, String dateKey) {
        this.userId = userId;
        this.dateKey = dateKey;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getDateKey() { return dateKey; }
    public int getWaterMl() { return waterMl; }
    public int getWorkoutMin() { return workoutMin; }
    public boolean isWorkoutDone() { return workoutDone; }
    public int getSleepMin() { return sleepMin; }
    public List<Meal> getMeals() { return meals; }

    public void setWaterMl(int waterMl) { this.waterMl = waterMl; }
    public void setWorkoutMin(int workoutMin) { this.workoutMin = workoutMin; }
    public void setWorkoutDone(boolean workoutDone) { this.workoutDone = workoutDone; }
    public void setSleepMin(int sleepMin) { this.sleepMin = sleepMin; }

    /** Keeps both sides of the relationship in sync. */
    public void addMeal(Meal meal) {
        meal.setDayLog(this);
        meals.add(meal);
    }

    public void removeMeal(Meal meal) {
        meals.remove(meal);
        meal.setDayLog(null);
    }
}
