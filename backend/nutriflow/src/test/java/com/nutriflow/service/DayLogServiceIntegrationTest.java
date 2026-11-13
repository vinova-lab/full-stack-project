package com.nutriflow.service;

import com.nutriflow.domain.User;
import com.nutriflow.dto.AuthResponse;
import com.nutriflow.dto.DayLogResponse;
import com.nutriflow.dto.MealRequest;
import com.nutriflow.exception.BadRequestException;
import com.nutriflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * TC-06 / TC-07 - full Service -> Repository -> H2 round trip (no HTTP layer).
 * Verifies BUSINESS RULE #3 (only done meals count) and #4 (range guards) against a real database.
 */
@SpringBootTest
class DayLogServiceIntegrationTest {

    @Autowired AuthService authService;
    @Autowired DayLogService dayLogService;
    @Autowired UserRepository userRepository;

    private User user;
    private final String today = LocalDate.now().toString();

    @BeforeEach
    void registerFreshUser() {
        AuthResponse res = authService.register("Tester",
                "tester-" + UUID.randomUUID() + "@example.com", "secret123");
        user = userRepository.findByToken(res.token()).orElseThrow();
    }

    @Test
    @DisplayName("TC-06 a planned meal adds 0 kcal; toggling it done adds its calories")
    void onlyDoneMealsCountTowardIntake() {
        DayLogResponse log = dayLogService.addMeal(user, today,
                new MealRequest("lunch", "Quinoa Buddha Bowl", "13:00", 480, 22, 68, 14, false));

        assertThat(log.meals()).hasSize(1);
        assertThat(log.consumed().kcal()).isZero();

        Long mealId = log.meals().get(0).id();
        DayLogResponse after = dayLogService.toggleMeal(user, today, mealId);

        assertThat(after.consumed().kcal()).isEqualTo(480);
        assertThat(after.consumed().proteinG()).isEqualTo(22);
        assertThat(after.wellness().breakdown().nutrition()).isEqualTo(20); // 480 / 2400
    }

    @Test
    @DisplayName("TC-07 water above 10 000 ml is rejected and nothing is persisted")
    void waterRangeGuard() {
        assertThatThrownBy(() -> dayLogService.setWater(user, today, 12_000))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("waterMl");

        assertThat(dayLogService.getOrCreate(user, today).waterMl()).isZero();
    }

    @Test
    @DisplayName("the same (user, date) always resolves to the same DayLog row")
    void oneLogPerUserPerDay() {
        DayLogResponse a = dayLogService.setWater(user, today, 500);
        DayLogResponse b = dayLogService.setSleep(user, today, 420);

        assertThat(b.id()).isEqualTo(a.id());
        assertThat(b.waterMl()).isEqualTo(500);
        assertThat(b.sleepMin()).isEqualTo(420);
        assertThat(dayLogService.history(user)).hasSize(1);
    }

    @Test
    @DisplayName("a malformed date key is rejected with 400")
    void badDateKey() {
        assertThatThrownBy(() -> dayLogService.getOrCreate(user, "27-10-2026"))
                .isInstanceOf(BadRequestException.class);
    }
}
