package com.service;

import com.dto.AuthResponse;
import com.dto.SignInRequest;
import com.dto.SignUpRequest;
import com.dto.UserResponse;
import com.entity.User;
import com.exception.EmailExistsException;
import com.exception.InvalidCredentialsException;
import com.mapper.UserMapper;
import com.repository.UserRepository;
import com.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    
    @Transactional
    public UserResponse signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailExistsException("Email already registered: " + request.getEmail());
        }
        
        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        User user = userMapper.toEntity(request, encryptedPassword);
        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }
    
    @Transactional(readOnly = true)
    public AuthResponse signIn(SignInRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );

            String token = jwtService.generateToken(request.getEmail());

            return AuthResponse.builder()
                    .accessToken(token)
                    .tokenType("Bearer")
                    .expiresIn(jwtService.getExpiration())
                    .build();

        } catch (Exception e) {
            throw new InvalidCredentialsException("Email ou senha inválidos!");
        }
    }
}