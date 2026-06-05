package com.repository;

import com.entity.MonthlyLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MonthlyLimitRepository extends JpaRepository<MonthlyLimit, UUID> {

    Optional<MonthlyLimit> findByUserEmailAndReferenceMonth(String email, LocalDate referenceMonth);

    Optional<MonthlyLimit> findByIdAndUserEmail(UUID id, String email);

    boolean existsByUserEmailAndReferenceMonth(String email, LocalDate referenceMonth);

    boolean existsByUserEmailAndReferenceMonthAndIdNot(
            String email,
            LocalDate referenceMonth,
            UUID id
    );
}
