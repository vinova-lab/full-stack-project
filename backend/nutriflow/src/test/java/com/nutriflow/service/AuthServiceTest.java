package com.nutriflow.service;

import com.nutriflow.domain.User;
import com.nutriflow.dto.AuthResponse;
import com.nutriflow.exception.ConflictException;
import com.nutriflow.exception.UnauthorizedException;
import com.nutriflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/** TC-04 / TC-05 - BUSINESS RULE #1 (registration integrity), repository mocked with Mockito. */
class AuthServiceTest {

    private UserRepository repo;
    private AuthService service;

    @BeforeEach
    void setUp() {
        repo = Mockito.mock(UserRepository.class);
        when(repo.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        service = new AuthService(repo, "demo@nutriflow.app");
    }

    @Test
    @DisplayName("TC-04 registering the reserved demo e-mail is rejected with 409")
    void reservedEmailIsRejected() {
        assertThatThrownBy(() -> service.register("X", "  DEMO@NutriFlow.app ", "secret123"))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("reserved");
        verify(repo, never()).save(any());
    }

    @Test
    @DisplayName("TC-05 duplicate e-mail (case/space-insensitive) is rejected with 409")
    void duplicateEmailIsRejected() {
        when(repo.existsByEmail("testuser@example.com")).thenReturn(true);

        assertThatThrownBy(() -> service.register("TestUser", " TestUser@Example.com ", "secret123"))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already exists");
        verify(repo, never()).save(any());
    }

    @Test
    @DisplayName("successful registration normalises the e-mail, hashes the password and issues a token")
    void successfulRegistration() {
        when(repo.existsByEmail("testuser@example.com")).thenReturn(false);

        AuthResponse res = service.register("  TestUser ", " TestUser@Example.com ", "secret123");

        assertThat(res.token()).startsWith("tok-");
        assertThat(res.user().email()).isEqualTo("testuser@example.com");
        assertThat(res.user().name()).isEqualTo("TestUser");
        verify(repo).save(any(User.class));
    }

    @Test
    @DisplayName("login with a wrong password is rejected with 401")
    void wrongPasswordIsRejected() {
        User stored = new User("TestUser", "testuser@example.com",
                com.nutriflow.service.calc.PasswordHasher.hash("correct-horse"));
        when(repo.findByEmail("testuser@example.com")).thenReturn(Optional.of(stored));

        assertThatThrownBy(() -> service.login("testuser@example.com", "wrong"))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Incorrect password");
    }
}
