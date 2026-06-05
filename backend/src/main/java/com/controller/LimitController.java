package com.controller;

import com.dto.LimitRequest;
import com.dto.LimitResponse;
import com.service.LimitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/limits")
@RequiredArgsConstructor
public class LimitController {

    private final LimitService limitService;

    @PostMapping
    public ResponseEntity<LimitResponse> createLimit(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody LimitRequest request
    ) {
        LimitResponse response = limitService.createLimit(userDetails.getUsername(), request);
        return ResponseEntity
                .created(URI.create("/limits/" + response.getId()))
                .body(response);
    }

    @GetMapping
    public ResponseEntity<LimitResponse> getLimitByMonth(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String referenceMonth
    ) {
        return ResponseEntity.ok(
                limitService.getLimitByMonth(userDetails.getUsername(), referenceMonth)
        );
    }

    @PutMapping("/{limitId}")
    public ResponseEntity<LimitResponse> updateLimit(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID limitId,
            @Valid @RequestBody LimitRequest request
    ) {
        return ResponseEntity.ok(
                limitService.updateLimit(userDetails.getUsername(), limitId, request)
        );
    }

    @DeleteMapping("/{limitId}")
    public ResponseEntity<Void> deleteLimit(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID limitId
    ) {
        limitService.deleteLimit(userDetails.getUsername(), limitId);
        return ResponseEntity.noContent().build();
    }
}
