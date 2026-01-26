package com.jayanianu.eventticketing.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterUserRequest {
    @NotBlank(message = "required field")
    private String name;

    @NotBlank(message = "email is required")
    private String email;

    @NotBlank
    @Size(max = 100,min = 3,message = "password should be between 100 and 3 characters")
    private String password;

    @NotBlank
    private String contact;

}
