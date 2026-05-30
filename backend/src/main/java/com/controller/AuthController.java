package com.controller;

import com.dto.AuthResponse;
import com.dto.SignInRequest;
import com.dto.SignUpRequest;
import com.dto.UserResponse;
import com.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        UserResponse response = authService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody SignInRequest request) {
        AuthResponse response = authService.signIn(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/signout")
    public ResponseEntity<Void> signOut() {
        // For MVP, just return OK
        // Frontend will remove the token
        // Future implementation can add token blacklist with Redis
        return ResponseEntity.ok().build();
    }
}