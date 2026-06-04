package com.service;

import com.dto.ExpenseRequest;
import com.dto.ExpenseResponse;
import com.entity.Expense;
import com.entity.User;
import com.exception.ExpenseException;
import com.exception.ExpenseNotFoundException;
import com.mapper.ExpenseMapper;
import com.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private static final DateTimeFormatter YEAR_MONTH_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM");

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;
    private final UserService userService;

    @Transactional
    public ExpenseResponse createExpense(String email, ExpenseRequest request) {
        User user = userService.getEntityByEmail(email);
        YearMonth referenceMonth = parseReferenceMonth(request.getReferenceMonth());

        validateCurrentOrFutureMonth(referenceMonth);

        Expense expense = Expense.builder()
                .user(user)
                .description(request.getDescription().trim())
                .amount(request.getAmount())
                .referenceMonth(referenceMonth.atDay(1))
                .build();

        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByMonth(String email, String referenceMonth) {
        YearMonth month = parseReferenceMonth(referenceMonth);

        return expenseRepository
                .findAllByUserEmailAndReferenceMonthOrderByCreatedAtDesc(email, month.atDay(1))
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Transactional
    public ExpenseResponse updateExpense(String email, UUID expenseId, ExpenseRequest request) {
        Expense expense = getExpenseByIdAndEmail(expenseId, email);
        validateLockedMonth(expense);

        YearMonth referenceMonth = parseReferenceMonth(request.getReferenceMonth());
        validateCurrentOrFutureMonth(referenceMonth);

        expense.setDescription(request.getDescription().trim());
        expense.setAmount(request.getAmount());
        expense.setReferenceMonth(referenceMonth.atDay(1));

        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    @Transactional
    public void deleteExpense(String email, UUID expenseId) {
        Expense expense = getExpenseByIdAndEmail(expenseId, email);
        validateLockedMonth(expense);
        expenseRepository.delete(expense);
    }

    private Expense getExpenseByIdAndEmail(UUID expenseId, String email) {
        return expenseRepository.findByIdAndUserEmail(expenseId, email)
                .orElseThrow(() -> new ExpenseNotFoundException("Despesa não encontrada"));
    }

    private YearMonth parseReferenceMonth(String referenceMonth) {
        try {
            return YearMonth.parse(referenceMonth, YEAR_MONTH_FORMATTER);
        } catch (DateTimeParseException exception) {
            throw new ExpenseException("Mês de referência inválido. Use o formato yyyy-MM");
        }
    }

    private void validateCurrentOrFutureMonth(YearMonth referenceMonth) {
        if (referenceMonth.isBefore(YearMonth.now())) {
            throw new ExpenseException("Não é permitido criar despesas de meses anteriores ao mês atual");
        }
    }

    private void validateLockedMonth(Expense expense) {
        YearMonth expenseMonth = YearMonth.from(expense.getReferenceMonth());
        if (expenseMonth.isBefore(YearMonth.now())) {
            throw new ExpenseException("Não é permitido editar ou excluir despesas de meses anteriores ao mês atual");
        }
    }
}
