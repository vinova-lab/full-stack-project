package com.nutriflow.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A NutriFlow account plus the body profile used to compute daily goals.
 * Table is named {@code app_users} because {@code USER} is a reserved word in H2.
 */
@Entity
@Table(name = "app_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    /** Salted SHA-256 hash, never the raw password. */
    @Column(nullable = false)
    private String passwordHash;

    /** Opaque session token returned to the client; null when logged out. */
    @Column(unique = true)
    private String token;

    private boolean demo;

    // ---- body profile (drives calorie / macro goals) ----
    private Integer age;
    private Double heightCm;
    private Double weightKg;
    private String goal;            // lose | maintain | gain | build
    private String activityLevel;   // sedentary | light | moderate | active | very_active
    private String dietPreference;
    private Integer waterGoalMl;
    private Integer sleepGoalMin;

    protected User() {
        // required by JPA
    }

    public User(String name, String email, String passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getToken() { return token; }
    public boolean isDemo() { return demo; }
    public Integer getAge() { return age; }
    public Double getHeightCm() { return heightCm; }
    public Double getWeightKg() { return weightKg; }
    public String getGoal() { return goal; }
    public String getActivityLevel() { return activityLevel; }
    public String getDietPreference() { return dietPreference; }
    public Integer getWaterGoalMl() { return waterGoalMl; }
    public Integer getSleepGoalMin() { return sleepGoalMin; }

    public void setName(String name) { this.name = name; }
    public void setToken(String token) { this.token = token; }
    public void setDemo(boolean demo) { this.demo = demo; }
    public void setAge(Integer age) { this.age = age; }
    public void setHeightCm(Double heightCm) { this.heightCm = heightCm; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public void setGoal(String goal) { this.goal = goal; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    public void setDietPreference(String dietPreference) { this.dietPreference = dietPreference; }
    public void setWaterGoalMl(Integer waterGoalMl) { this.waterGoalMl = waterGoalMl; }
    public void setSleepGoalMin(Integer sleepGoalMin) { this.sleepGoalMin = sleepGoalMin; }
}
