package com.skillhub.userservice;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User registerUser(User user) {
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );
        return userRepository.save(user);
    }

    public Optional<User> loginUser(
            String email, String password) {

        Optional<User> userOptional =
                userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (passwordEncoder.matches(
                    password, user.getPassword())) {
                return Optional.of(user);
            }
        }

        return Optional.empty();
    }
}
