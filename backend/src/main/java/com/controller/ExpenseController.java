package com.controller;

import com.dto.ExpenseRequest;
import com.dto.ExpenseResponse;
import com.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ExpenseRequest request
    ) {
        ExpenseResponse response = expenseService.createExpense(userDetails.getUsername(), request);
        return ResponseEntity
                .created(URI.create("/expenses/" + response.getId()))
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getExpensesByMonth(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String referenceMonth
    ) {
        return ResponseEntity.ok(
                expenseService.getExpensesByMonth(userDetails.getUsername(), referenceMonth)
        );
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID expenseId,
            @Valid @RequestBody ExpenseRequest request
    ) {
        return ResponseEntity.ok(
                expenseService.updateExpense(userDetails.getUsername(), expenseId, request)
        );
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID expenseId
    ) {
        expenseService.deleteExpense(userDetails.getUsername(), expenseId);
        return ResponseEntity.noContent().build();
    }
}
