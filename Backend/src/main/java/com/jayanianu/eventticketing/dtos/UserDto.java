package com.jayanianu.eventticketing.dtos;

import com.jayanianu.eventticketing.entities.Role;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
}
