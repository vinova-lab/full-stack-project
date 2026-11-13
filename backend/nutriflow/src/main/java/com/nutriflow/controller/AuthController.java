package com.nutriflow.controller;

import com.nutriflow.dto.AuthResponse;
import com.nutriflow.dto.LoginRequest;
import com.nutriflow.dto.RegisterRequest;
import com.nutriflow.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * PRESENTATION LAYER - translates HTTP into service calls. No business logic lives here.
 *
 *   POST /api/auth/register  { name, email, password } -> 201 { token, user }
 *   POST /api/auth/login     { email, password }       -> 200 { token, user }
 *   POST /api/auth/logout    (Authorization: Bearer)   -> 204
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse body = authService.register(req.name(), req.email(), req.password());
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req.email(), req.password());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader(value = "Authorization", required = false) String auth) {
        authService.logout(auth);
    }
}
