package com.nutriflow.repository;

import com.nutriflow.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Data-access interface for {@link User}. Spring Data JPA generates the implementation
 * at runtime; the custom methods are derived from their names (findBy&lt;Field&gt;).
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByToken(String token);

    boolean existsByEmail(String email);
}
