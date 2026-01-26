package com.jayanianu.eventticketing.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String name;
    private String email;
    private String contact;
}
