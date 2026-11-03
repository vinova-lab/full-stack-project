package com.skillhub.userservice;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class UserServiceApplicationTests {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserController userController;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void cleanUp() {
        userRepository.deleteAll();
    }

    @Test
    void contextLoads() {
        assertThat(userService).isNotNull();
        assertThat(userRepository).isNotNull();
        assertThat(userController).isNotNull();
        assertThat(passwordEncoder).isNotNull();
    }

    @Test
    void testRegisterUserHashesPassword() {
        User rawUser = new User("Priya Sharma", "priya@example.com", "DemoPass456");
        User registered = userService.registerUser(rawUser);

        assertThat(registered.getId()).isNotNull();
        assertThat(registered.getName()).isEqualTo("Priya Sharma");
        assertThat(registered.getEmail()).isEqualTo("priya@example.com");
        // Password must NOT be plain text
        assertThat(registered.getPassword()).isNotEqualTo("DemoPass456");
        // Password must match BCrypt hash pattern
        assertThat(registered.getPassword()).startsWith("$2");
        assertThat(passwordEncoder.matches("DemoPass456", registered.getPassword())).isTrue();
    }

    @Test
    void testLoginUserSuccessAndFailure() {
        User user = new User("Priya Sharma", "priya@example.com", "DemoPass456");
        userService.registerUser(user);

        // Valid login
        Optional<User> success = userService.loginUser("priya@example.com", "DemoPass456");
        assertThat(success).isPresent();
        assertThat(success.get().getName()).isEqualTo("Priya Sharma");

        // Invalid password
        Optional<User> failWrongPw = userService.loginUser("priya@example.com", "WrongPw");
        assertThat(failWrongPw).isEmpty();

        // Invalid email
        Optional<User> failWrongEmail = userService.loginUser("unknown@example.com", "DemoPass456");
        assertThat(failWrongEmail).isEmpty();
    }

    @Test
    void testUserControllerEndpointsDoNotExposePassword() {
        User user = new User("Arun Kumar", "arun@example.com", "SecretPass123");
        UserResponse response = userController.registerUser(user);

        assertThat(response.getId()).isNotNull();
        assertThat(response.getName()).isEqualTo("Arun Kumar");
        assertThat(response.getEmail()).isEqualTo("arun@example.com");

        // GET /api/users
        List<UserResponse> allUsers = userController.getAllUsers();
        assertThat(allUsers).hasSize(1);
        assertThat(allUsers.get(0).getName()).isEqualTo("Arun Kumar");

        // POST /api/users/login valid
        ResponseEntity<?> loginOk = userController.loginUser(Map.of(
                "email", "arun@example.com",
                "password", "SecretPass123"
        ));
        assertThat(loginOk.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(loginOk.getBody()).isInstanceOf(UserResponse.class);

        // POST /api/users/login invalid
        ResponseEntity<?> loginFail = userController.loginUser(Map.of(
                "email", "arun@example.com",
                "password", "WrongPassword"
        ));
        assertThat(loginFail.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}
