package com.nutriflow.service.calc;

import com.nutriflow.dto.GoalsResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/** TC-01 / TC-02 - BUSINESS RULE #2 (calorie target & macros). Pure unit test, no Spring. */
class GoalCalculatorTest {

    @Test
    @DisplayName("TC-01 demo profile (68 kg, 172 cm, 24 y, moderate, maintain) -> 2400 kcal")
    void demoProfileCalorieTarget() {
        // BMR = 10*68 + 6.25*172 - 5*24 - 78 = 1557 ; TDEE = 1557 * 1.55 = 2413.35 ; round to 50 -> 2400
        int kcal = GoalCalculator.calorieTarget(68.0, 172.0, 24, "moderate", "maintain");
        assertThat(kcal).isEqualTo(2400);
    }

    @Test
    @DisplayName("TC-02 'lose' goal applies a -15 % offset and uses the high-protein split")
    void loseGoalLowersTargetAndRaisesProtein() {
        GoalsResponse g = GoalCalculator.goals(68.0, 172.0, 24, "moderate", "lose", null, null);

        assertThat(g.calories()).isEqualTo(2050);           // 2413.35 * 0.85 = 2051.35 -> 2050
        assertThat(g.proteinG()).isEqualTo(154);            // 2050 * 0.30 / 4 = 153.75
        assertThat(g.fatG()).isEqualTo(64);                 // 2050 * 0.28 / 9 = 63.78
        assertThat(g.carbsG()).isEqualTo(215);              // 2050 * 0.42 / 4 = 215.25
        assertThat(g.waterMl()).isEqualTo(GoalCalculator.DEFAULT_WATER_GOAL_ML);
        assertThat(g.sleepMin()).isEqualTo(GoalCalculator.DEFAULT_SLEEP_GOAL_MIN);
    }

    @Test
    @DisplayName("missing profile values fall back to the frontend defaults (70 kg / 170 cm / 25 y)")
    void nullProfileUsesDefaults() {
        int kcal = GoalCalculator.calorieTarget(null, null, null, null, null);
        assertThat(kcal).isEqualTo(2400);                   // 1559.5 * 1.55 = 2417.2 -> 2400
    }
}
