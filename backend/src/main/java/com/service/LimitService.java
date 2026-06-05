package com.service;

import com.dto.LimitRequest;
import com.dto.LimitResponse;
import com.entity.MonthlyLimit;
import com.entity.User;
import com.exception.LimitException;
import com.exception.LimitNotFoundException;
import com.mapper.LimitMapper;
import com.repository.MonthlyLimitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LimitService {

    private static final DateTimeFormatter YEAR_MONTH_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM");

    private final MonthlyLimitRepository monthlyLimitRepository;
    private final LimitMapper limitMapper;
    private final UserService userService;

    @Transactional
    public LimitResponse createLimit(String email, LimitRequest request) {
        User user = userService.getEntityByEmail(email);
        YearMonth referenceMonth = parseReferenceMonth(request.getReferenceMonth());

        validateCurrentOrFutureMonth(referenceMonth);

        if (monthlyLimitRepository.existsByUserEmailAndReferenceMonth(email, referenceMonth.atDay(1))) {
            throw new LimitException("Já existe um limite cadastrado para este mês");
        }

        MonthlyLimit monthlyLimit = MonthlyLimit.builder()
                .user(user)
                .amount(request.getAmount())
                .referenceMonth(referenceMonth.atDay(1))
                .build();

        try {
            return limitMapper.toResponse(monthlyLimitRepository.save(monthlyLimit));
        } catch (DataIntegrityViolationException exception) {
            throw new LimitException("Já existe um limite cadastrado para este mês");
        }
    }

    @Transactional(readOnly = true)
    public LimitResponse getLimitByMonth(String email, String referenceMonth) {
        YearMonth month = parseReferenceMonth(referenceMonth);

        return monthlyLimitRepository
                .findByUserEmailAndReferenceMonth(email, month.atDay(1))
                .map(limitMapper::toResponse)
                .orElse(null);
    }

    @Transactional
    public LimitResponse updateLimit(String email, UUID limitId, LimitRequest request) {
        MonthlyLimit monthlyLimit = getLimitByIdAndEmail(limitId, email);
        validateLockedMonth(monthlyLimit);

        YearMonth referenceMonth = parseReferenceMonth(request.getReferenceMonth());
        validateCurrentOrFutureMonth(referenceMonth);

        if (monthlyLimitRepository.existsByUserEmailAndReferenceMonthAndIdNot(
                email,
                referenceMonth.atDay(1),
                limitId
        )) {
            throw new LimitException("Já existe um limite cadastrado para este mês");
        }

        monthlyLimit.setAmount(request.getAmount());
        monthlyLimit.setReferenceMonth(referenceMonth.atDay(1));

        try {
            return limitMapper.toResponse(monthlyLimitRepository.save(monthlyLimit));
        } catch (DataIntegrityViolationException exception) {
            throw new LimitException("Já existe um limite cadastrado para este mês");
        }
    }

    @Transactional
    public void deleteLimit(String email, UUID limitId) {
        MonthlyLimit monthlyLimit = getLimitByIdAndEmail(limitId, email);
        validateLockedMonth(monthlyLimit);
        monthlyLimitRepository.delete(monthlyLimit);
    }

    private MonthlyLimit getLimitByIdAndEmail(UUID limitId, String email) {
        return monthlyLimitRepository.findByIdAndUserEmail(limitId, email)
                .orElseThrow(() -> new LimitNotFoundException("Limite não encontrado"));
    }

    private YearMonth parseReferenceMonth(String referenceMonth) {
        try {
            return YearMonth.parse(referenceMonth, YEAR_MONTH_FORMATTER);
        } catch (DateTimeParseException exception) {
            throw new LimitException("Mês de referência inválido. Use o formato yyyy-MM");
        }
    }

    private void validateCurrentOrFutureMonth(YearMonth referenceMonth) {
        if (referenceMonth.isBefore(YearMonth.now())) {
            throw new LimitException("Não é permitido criar ou editar limites de meses anteriores ao mês atual");
        }
    }

    private void validateLockedMonth(MonthlyLimit monthlyLimit) {
        YearMonth limitMonth = YearMonth.from(monthlyLimit.getReferenceMonth());
        if (limitMonth.isBefore(YearMonth.now())) {
            throw new LimitException("Não é permitido editar ou excluir limites de meses anteriores ao mês atual");
        }
    }
}
