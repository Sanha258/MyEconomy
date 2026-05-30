package com.mapper;

import com.dto.SignUpRequest;
import com.dto.UserResponse;
import com.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public User toEntity(SignUpRequest request, String encryptedPassword) {
        return User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(encryptedPassword)
                .birthDate(request.getBirthDate())
                .build();
    }
    
    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .birthDate(user.getBirthDate())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}