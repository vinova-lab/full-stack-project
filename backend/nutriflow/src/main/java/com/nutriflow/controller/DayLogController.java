package com.nutriflow.controller;

import com.nutriflow.domain.User;
import com.nutriflow.dto.DayLogResponse;
import com.nutriflow.dto.MealRequest;
import com.nutriflow.dto.SleepRequest;
import com.nutriflow.dto.WaterRequest;
import com.nutriflow.dto.WellnessResponse;
import com.nutriflow.dto.WorkoutRequest;
import com.nutriflow.service.AuthService;
import com.nutriflow.service.DayLogService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * PRESENTATION LAYER for the day log - exactly the contract documented in src/services/apiClient.js:
 *
 *   GET    /api/log                      -> DayLogResponse[]   (history, newest first)
 *   GET    /api/log/{date}               -> DayLogResponse     (creates an empty log on first access)
 *   POST   /api/log/{date}/meal          Meal -> DayLogResponse
 *   PUT    /api/log/{date}/meal/{id}     Meal -> DayLogResponse
 *   PATCH  /api/log/{date}/meal/{id}/toggle  -> DayLogResponse
 *   DELETE /api/log/{date}/meal/{id}     -> DayLogResponse
 *   PUT    /api/log/{date}/water         { waterMl }           -> DayLogResponse
 *   PUT    /api/log/{date}/workout       { workoutMin, done }  -> DayLogResponse
 *   PUT    /api/log/{date}/sleep         { sleepMin }          -> DayLogResponse
 *   GET    /api/log/{date}/wellness      -> WellnessResponse
 */
@RestController
@RequestMapping("/api/log")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class DayLogController {

    private final AuthService authService;
    private final DayLogService dayLogService;

    public DayLogController(AuthService authService, DayLogService dayLogService) {
        this.authService = authService;
        this.dayLogService = dayLogService;
    }

    @GetMapping
    public List<DayLogResponse> history(@RequestHeader(value = "Authorization", required = false) String auth) {
        return dayLogService.history(authService.requireUser(auth));
    }

    @GetMapping("/{date}")
    public DayLogResponse get(@RequestHeader(value = "Authorization", required = false) String auth,
                              @PathVariable String date) {
        return dayLogService.getOrCreate(authService.requireUser(auth), date);
    }

    @GetMapping("/{date}/wellness")
    public WellnessResponse wellness(@RequestHeader(value = "Authorization", required = false) String auth,
                                     @PathVariable String date) {
        return dayLogService.getOrCreate(authService.requireUser(auth), date).wellness();
    }

    @PostMapping("/{date}/meal")
    public DayLogResponse addMeal(@RequestHeader(value = "Authorization", required = false) String auth,
                                  @PathVariable String date,
                                  @Valid @RequestBody MealRequest req) {
        return dayLogService.addMeal(authService.requireUser(auth), date, req);
    }

    @PutMapping("/{date}/meal/{id}")
    public DayLogResponse updateMeal(@RequestHeader(value = "Authorization", required = false) String auth,
                                     @PathVariable String date, @PathVariable Long id,
                                     @Valid @RequestBody MealRequest req) {
        return dayLogService.updateMeal(authService.requireUser(auth), date, id, req);
    }

    @PatchMapping("/{date}/meal/{id}/toggle")
    public DayLogResponse toggleMeal(@RequestHeader(value = "Authorization", required = false) String auth,
                                     @PathVariable String date, @PathVariable Long id) {
        return dayLogService.toggleMeal(authService.requireUser(auth), date, id);
    }

    @DeleteMapping("/{date}/meal/{id}")
    public DayLogResponse removeMeal(@RequestHeader(value = "Authorization", required = false) String auth,
                                     @PathVariable String date, @PathVariable Long id) {
        return dayLogService.removeMeal(authService.requireUser(auth), date, id);
    }

    @PutMapping("/{date}/water")
    public DayLogResponse water(@RequestHeader(value = "Authorization", required = false) String auth,
                                @PathVariable String date, @Valid @RequestBody WaterRequest req) {
        return dayLogService.setWater(authService.requireUser(auth), date, req.waterMl());
    }

    @PutMapping("/{date}/workout")
    public DayLogResponse workout(@RequestHeader(value = "Authorization", required = false) String auth,
                                  @PathVariable String date, @Valid @RequestBody WorkoutRequest req) {
        return dayLogService.setWorkout(authService.requireUser(auth), date, req.workoutMin(), req.done());
    }

    @PutMapping("/{date}/sleep")
    public DayLogResponse sleep(@RequestHeader(value = "Authorization", required = false) String auth,
                                @PathVariable String date, @Valid @RequestBody SleepRequest req) {
        return dayLogService.setSleep(authService.requireUser(auth), date, req.sleepMin());
    }
}
