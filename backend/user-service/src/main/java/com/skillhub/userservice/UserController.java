package com.skillhub.userservice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                ))
                .toList();
    }

    @PostMapping
    public UserResponse registerUser(
            @RequestBody User user) {

        User savedUser = userService.registerUser(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody Map<String, String> credentials) {

        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Email and password are required."
                    ));
        }

        return userService.loginUser(email, password)
                .<ResponseEntity<?>>map(user ->
                        ResponseEntity.ok(
                                new UserResponse(
                                        user.getId(),
                                        user.getName(),
                                        user.getEmail()
                                )
                        )
                )
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of(
                                        "message",
                                        "Invalid email or password."
                                ))
                );
    }
}
