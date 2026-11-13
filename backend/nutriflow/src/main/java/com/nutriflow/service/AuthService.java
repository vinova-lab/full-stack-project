package com.nutriflow.service;

import com.nutriflow.domain.User;
import com.nutriflow.dto.AuthResponse;
import com.nutriflow.dto.UserResponse;
import com.nutriflow.exception.ConflictException;
import com.nutriflow.exception.UnauthorizedException;
import com.nutriflow.repository.UserRepository;
import com.nutriflow.service.calc.PasswordHasher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * BUSINESS LAYER - account rules (port of authService.js).
 *
 * BUSINESS RULE #1 - Registration integrity:
 *   - e-mail is normalised (trim + lower-case) before any comparison or storage
 *   - the demo e-mail is reserved and cannot be registered
 *   - an e-mail can only be registered once
 *   - passwords are stored as salted hashes, never raw
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final String demoEmail;

    public AuthService(UserRepository userRepository,
                       @Value("${nutriflow.demo.email:demo@nutriflow.app}") String demoEmail) {
        this.userRepository = userRepository;
        this.demoEmail = normalise(demoEmail);
    }

    public static String normalise(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    @Transactional
    public AuthResponse register(String name, String email, String password) {
        String e = normalise(email);

        if (e.equals(demoEmail)) {
            throw new ConflictException("That email address is reserved. Please use another.");
        }
        if (userRepository.existsByEmail(e)) {
            throw new ConflictException("An account with that email already exists.");
        }

        User user = new User(name.trim(), e, PasswordHasher.hash(password));
        user.setToken(newToken());
        user = userRepository.save(user);
        return new AuthResponse(user.getToken(), UserResponse.from(user));
    }

    @Transactional
    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(normalise(email))
                .orElseThrow(() -> new UnauthorizedException("No account found with that email."));

        if (!PasswordHasher.matches(password, user.getPasswordHash())) {
            throw new UnauthorizedException("Incorrect password. Please try again.");
        }

        user.setToken(newToken());
        userRepository.save(user);
        return new AuthResponse(user.getToken(), UserResponse.from(user));
    }

    @Transactional
    public void logout(String bearerToken) {
        userRepository.findByToken(stripBearer(bearerToken)).ifPresent(u -> {
            u.setToken(null);
            userRepository.save(u);
        });
    }

    /** Resolves the current user from an {@code Authorization: Bearer <token>} header. */
    @Transactional(readOnly = true)
    public User requireUser(String bearerToken) {
        String token = stripBearer(bearerToken);
        if (token.isBlank()) {
            throw new UnauthorizedException("Missing Authorization header.");
        }
        return userRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired session token."));
    }

    static String stripBearer(String header) {
        if (header == null) {
            return "";
        }
        String h = header.trim();
        return h.regionMatches(true, 0, "Bearer ", 0, 7) ? h.substring(7).trim() : h;
    }

    private static String newToken() {
        return "tok-" + UUID.randomUUID();
    }
}
