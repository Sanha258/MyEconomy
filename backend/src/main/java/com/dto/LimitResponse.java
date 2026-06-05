package com.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LimitResponse {

    private UUID id;
    private BigDecimal amount;
    private String referenceMonth;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
