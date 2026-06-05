package com.mapper;

import com.dto.LimitResponse;
import com.entity.MonthlyLimit;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class LimitMapper {

    private static final DateTimeFormatter YEAR_MONTH_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM");

    public LimitResponse toResponse(MonthlyLimit monthlyLimit) {
        return LimitResponse.builder()
                .id(monthlyLimit.getId())
                .amount(monthlyLimit.getAmount())
                .referenceMonth(monthlyLimit.getReferenceMonth().format(YEAR_MONTH_FORMATTER))
                .createdAt(monthlyLimit.getCreatedAt())
                .updatedAt(monthlyLimit.getUpdatedAt())
                .build();
    }
}
