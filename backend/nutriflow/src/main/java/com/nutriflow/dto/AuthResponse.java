package com.nutriflow.dto;

/** Matches the frontend contract: POST /api/auth/login -> { token, user } */
public record AuthResponse(String token, UserResponse user) {
}
