package com.jayanianu.eventticketing.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Username is required")
    @Email
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
