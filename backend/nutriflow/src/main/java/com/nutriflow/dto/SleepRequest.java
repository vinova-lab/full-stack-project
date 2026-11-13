package com.nutriflow.dto;

import jakarta.validation.constraints.NotNull;

public record SleepRequest(@NotNull Integer sleepMin) {
}
