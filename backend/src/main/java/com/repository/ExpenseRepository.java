package com.repository;

import com.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    List<Expense> findAllByUserEmailAndReferenceMonthOrderByCreatedAtDesc(
            String email,
            LocalDate referenceMonth
    );

    Optional<Expense> findByIdAndUserEmail(UUID id, String email);
}
