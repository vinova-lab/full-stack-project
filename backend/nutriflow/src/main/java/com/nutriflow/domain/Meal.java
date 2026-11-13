package com.nutriflow.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * A single meal entry inside a {@link DayLog}.
 * Field names follow the frontend meal object: type, name, time, kcal, p, c, f, done.
 */
@Entity
@Table(name = "meals")
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "day_log_id")
    private DayLog dayLog;

    @Column(nullable = false)
    private String type;   // breakfast | lunch | dinner | snack

    @Column(nullable = false)
    private String name;

    @Column(name = "meal_time")
    private String time;   // HH:mm
    private int kcal;
    private int proteinG;
    private int carbsG;
    private int fatG;
    private boolean done;

    protected Meal() {
        // required by JPA
    }

    public Meal(String type, String name, String time, int kcal, int proteinG, int carbsG, int fatG) {
        this.type = type;
        this.name = name;
        this.time = time;
        this.kcal = kcal;
        this.proteinG = proteinG;
        this.carbsG = carbsG;
        this.fatG = fatG;
    }

    public Long getId() { return id; }
    public DayLog getDayLog() { return dayLog; }
    public String getType() { return type; }
    public String getName() { return name; }
    public String getTime() { return time; }
    public int getKcal() { return kcal; }
    public int getProteinG() { return proteinG; }
    public int getCarbsG() { return carbsG; }
    public int getFatG() { return fatG; }
    public boolean isDone() { return done; }

    void setDayLog(DayLog dayLog) { this.dayLog = dayLog; }
    public void setType(String type) { this.type = type; }
    public void setName(String name) { this.name = name; }
    public void setTime(String time) { this.time = time; }
    public void setKcal(int kcal) { this.kcal = kcal; }
    public void setProteinG(int proteinG) { this.proteinG = proteinG; }
    public void setCarbsG(int carbsG) { this.carbsG = carbsG; }
    public void setFatG(int fatG) { this.fatG = fatG; }
    public void setDone(boolean done) { this.done = done; }
}
