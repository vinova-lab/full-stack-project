package com.nutriflow.repository;

import com.nutriflow.domain.DayLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DayLogRepository extends JpaRepository<DayLog, Long> {

    Optional<DayLog> findByUserIdAndDateKey(Long userId, String dateKey);

    List<DayLog> findByUserIdOrderByDateKeyDesc(Long userId);
}
