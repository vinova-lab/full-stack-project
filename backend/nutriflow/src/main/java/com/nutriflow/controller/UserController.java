package com.nutriflow.controller;

import com.nutriflow.domain.User;
import com.nutriflow.dto.GoalsResponse;
import com.nutriflow.dto.ProfileUpdateRequest;
import com.nutriflow.dto.UserResponse;
import com.nutriflow.service.AuthService;
import com.nutriflow.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *   GET /api/user/profile  -> UserResponse
 *   PUT /api/user/profile  -> UserResponse
 *   GET /api/goals         -> GoalsResponse (computed from the profile)
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class UserController {

    private final AuthService authService;
    private final UserService userService;

    public UserController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @GetMapping("/user/profile")
    public UserResponse profile(@RequestHeader(value = "Authorization", required = false) String auth) {
        User user = authService.requireUser(auth);
        return userService.profile(user);
    }

    @PutMapping("/user/profile")
    public UserResponse update(@RequestHeader(value = "Authorization", required = false) String auth,
                               @Valid @RequestBody ProfileUpdateRequest req) {
        User user = authService.requireUser(auth);
        return userService.updateProfile(user, req);
    }

    @GetMapping("/goals")
    public GoalsResponse goals(@RequestHeader(value = "Authorization", required = false) String auth) {
        User user = authService.requireUser(auth);
        return userService.goals(user);
    }
}
