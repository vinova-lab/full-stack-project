package com.nutriflow.service.calc;

import com.nutriflow.dto.WellnessResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/** TC-03 - BUSINESS RULE #3 (weighted wellness score). */
class WellnessCalculatorTest {

    @Test
    @DisplayName("TC-03 demo day: 1170/1850 kcal, 1800/2500 ml, 0/30 min, 462/480 min -> score 56")
    void demoDayScore() {
        WellnessResponse w = WellnessCalculator.score(1170, 1850, 1800, 2500, 0, 30, 462, 480);

        assertThat(w.breakdown().nutrition()).isEqualTo(63);   // 63.24
        assertThat(w.breakdown().hydration()).isEqualTo(72);
        assertThat(w.breakdown().activity()).isEqualTo(0);
        assertThat(w.breakdown().sleep()).isEqualTo(96);       // 96.25
        assertThat(w.score()).isEqualTo(56);                   // 18.9 + 18 + 0 + 19.2 = 56.1
    }

    @Test
    @DisplayName("eating 50 % over target zeroes the nutrition component")
    void overTargetIsPenalised() {
        WellnessResponse w = WellnessCalculator.score(2700, 1800, 0, 2500, 0, 30, 0, 480);
        assertThat(w.breakdown().nutrition()).isZero();
        assertThat(w.score()).isZero();
    }

    @Test
    @DisplayName("components are clamped at 100 even when goals are exceeded")
    void componentsClampAt100() {
        WellnessResponse w = WellnessCalculator.score(1800, 1800, 5000, 2500, 90, 30, 600, 480);
        assertThat(w.breakdown().hydration()).isEqualTo(100);
        assertThat(w.breakdown().activity()).isEqualTo(100);
        assertThat(w.breakdown().sleep()).isEqualTo(100);
        assertThat(w.score()).isEqualTo(100);
    }
}
