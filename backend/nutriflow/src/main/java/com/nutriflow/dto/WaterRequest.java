package com.nutriflow.dto;

import jakarta.validation.constraints.NotNull;

public record WaterRequest(@NotNull Integer waterMl) {
}
