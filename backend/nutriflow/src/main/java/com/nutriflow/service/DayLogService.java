package com.nutriflow.service;

import com.nutriflow.domain.DayLog;
import com.nutriflow.domain.Meal;
import com.nutriflow.domain.User;
import com.nutriflow.dto.DayLogResponse;
import com.nutriflow.dto.GoalsResponse;
import com.nutriflow.dto.IntakeTotals;
import com.nutriflow.dto.MealRequest;
import com.nutriflow.dto.MealResponse;
import com.nutriflow.dto.WellnessResponse;
import com.nutriflow.exception.BadRequestException;
import com.nutriflow.exception.NotFoundException;
import com.nutriflow.repository.DayLogRepository;
import com.nutriflow.service.calc.WellnessCalculator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

/**
 * BUSINESS LAYER - everything about a user's daily log.
 *
 * BUSINESS RULE #3 - only meals marked {@code done} count toward intake and the wellness score
 *                    (planned meals are visible but do not add calories).
 * BUSINESS RULE #4 - range guards: water 0-10 000 ml, workout 0-600 min, sleep 0-1 440 min,
 *                    and the date must be a real ISO date not in the future.
 */
@Service
public class DayLogService {

    public static final int MAX_WATER_ML = 10_000;
    public static final int MAX_WORKOUT_MIN = 600;
    public static final int MAX_SLEEP_MIN = 1_440;

    private final DayLogRepository dayLogRepository;
    private final UserService userService;

    public DayLogService(DayLogRepository dayLogRepository, UserService userService) {
        this.dayLogRepository = dayLogRepository;
        this.userService = userService;
    }

    // ------------------------------------------------------------------ reads

    @Transactional
    public DayLogResponse getOrCreate(User user, String dateKey) {
        return toResponse(load(user, dateKey), user);
    }

    @Transactional(readOnly = true)
    public List<DayLogResponse> history(User user) {
        return dayLogRepository.findByUserIdOrderByDateKeyDesc(user.getId())
                .stream().map(log -> toResponse(log, user)).toList();
    }

    // ------------------------------------------------------------------ meals

    @Transactional
    public DayLogResponse addMeal(User user, String dateKey, MealRequest req) {
        if (req.type() == null || req.name() == null || req.name().isBlank()) {
            throw new BadRequestException("A meal needs at least a type and a name.");
        }
        DayLog log = load(user, dateKey);
        Meal meal = new Meal(req.type(), req.name().trim(), req.time(),
                nz(req.kcal()), nz(req.p()), nz(req.c()), nz(req.f()));
        meal.setDone(Boolean.TRUE.equals(req.done()));
        log.addMeal(meal);
        return toResponse(dayLogRepository.save(log), user);
    }

    @Transactional
    public DayLogResponse updateMeal(User user, String dateKey, Long mealId, MealRequest req) {
        DayLog log = load(user, dateKey);
        Meal meal = findMeal(log, mealId);
        if (req.type() != null) meal.setType(req.type());
        if (req.name() != null && !req.name().isBlank()) meal.setName(req.name().trim());
        if (req.time() != null) meal.setTime(req.time());
        if (req.kcal() != null) meal.setKcal(req.kcal());
        if (req.p() != null) meal.setProteinG(req.p());
        if (req.c() != null) meal.setCarbsG(req.c());
        if (req.f() != null) meal.setFatG(req.f());
        if (req.done() != null) meal.setDone(req.done());
        return toResponse(dayLogRepository.save(log), user);
    }

    @Transactional
    public DayLogResponse toggleMeal(User user, String dateKey, Long mealId) {
        DayLog log = load(user, dateKey);
        Meal meal = findMeal(log, mealId);
        meal.setDone(!meal.isDone());
        return toResponse(dayLogRepository.save(log), user);
    }

    @Transactional
    public DayLogResponse removeMeal(User user, String dateKey, Long mealId) {
        DayLog log = load(user, dateKey);
        log.removeMeal(findMeal(log, mealId));
        return toResponse(dayLogRepository.save(log), user);
    }

    // ------------------------------------------------------------------ water / workout / sleep

    @Transactional
    public DayLogResponse setWater(User user, String dateKey, int waterMl) {
        requireRange(waterMl, 0, MAX_WATER_ML, "waterMl");
        DayLog log = load(user, dateKey);
        log.setWaterMl(waterMl);
        return toResponse(dayLogRepository.save(log), user);
    }

    @Transactional
    public DayLogResponse setWorkout(User user, String dateKey, int workoutMin, Boolean done) {
        requireRange(workoutMin, 0, MAX_WORKOUT_MIN, "workoutMin");
        DayLog log = load(user, dateKey);
        log.setWorkoutMin(workoutMin);
        log.setWorkoutDone(done != null ? done : workoutMin > 0);
        return toResponse(dayLogRepository.save(log), user);
    }

    @Transactional
    public DayLogResponse setSleep(User user, String dateKey, int sleepMin) {
        requireRange(sleepMin, 0, MAX_SLEEP_MIN, "sleepMin");
        DayLog log = load(user, dateKey);
        log.setSleepMin(sleepMin);
        return toResponse(dayLogRepository.save(log), user);
    }

    // ------------------------------------------------------------------ pure helpers (unit-testable)

    /** BUSINESS RULE #3 - sums only completed meals. */
    public static IntakeTotals consumed(List<Meal> meals) {
        int kcal = 0, p = 0, c = 0, f = 0;
        for (Meal m : meals) {
            if (m.isDone()) {
                kcal += m.getKcal();
                p += m.getProteinG();
                c += m.getCarbsG();
                f += m.getFatG();
            }
        }
        return new IntakeTotals(kcal, p, c, f);
    }

    /** BUSINESS RULE #4 - date must parse as ISO-8601 and not be in the future. */
    public static String validateDateKey(String dateKey) {
        try {
            LocalDate d = LocalDate.parse(dateKey);
            if (d.isAfter(LocalDate.now().plusDays(1))) {
                throw new BadRequestException("Cannot log a day in the future: " + dateKey);
            }
            return d.toString();
        } catch (DateTimeParseException ex) {
            throw new BadRequestException("Date must be in yyyy-MM-dd format, got: " + dateKey);
        }
    }

    // ------------------------------------------------------------------ private

    private DayLog load(User user, String rawDateKey) {
        String dateKey = validateDateKey(rawDateKey);
        return dayLogRepository.findByUserIdAndDateKey(user.getId(), dateKey)
                .orElseGet(() -> dayLogRepository.save(new DayLog(user.getId(), dateKey)));
    }

    private static Meal findMeal(DayLog log, Long mealId) {
        return log.getMeals().stream()
                .filter(m -> m.getId().equals(mealId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Meal " + mealId + " not found on " + log.getDateKey()));
    }

    private DayLogResponse toResponse(DayLog log, User user) {
        IntakeTotals totals = consumed(log.getMeals());
        GoalsResponse goals = userService.goals(user);
        WellnessResponse wellness = WellnessCalculator.score(
                totals.kcal(), goals.calories(),
                log.getWaterMl(), goals.waterMl(),
                log.getWorkoutMin(), goals.workoutMin(),
                log.getSleepMin(), goals.sleepMin());

        return new DayLogResponse(
                log.getId(), log.getDateKey(),
                log.getMeals().stream().map(MealResponse::from).toList(),
                log.getWaterMl(), log.getWorkoutMin(), log.isWorkoutDone(), log.getSleepMin(),
                totals, wellness);
    }

    private static void requireRange(int value, int min, int max, String field) {
        if (value < min || value > max) {
            throw new BadRequestException(field + " must be between " + min + " and " + max + ".");
        }
    }

    private static int nz(Integer v) {
        return v == null ? 0 : v;
    }
}
