package com.mapper;

import com.dto.ExpenseResponse;
import com.entity.Expense;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class ExpenseMapper {

    private static final DateTimeFormatter YEAR_MONTH_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM");

    public ExpenseResponse toResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .referenceMonth(expense.getReferenceMonth().format(YEAR_MONTH_FORMATTER))
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }
}
