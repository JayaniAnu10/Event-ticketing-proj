package com.jayanianu.eventticketing.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AdminUserDetails {
    private Long id;
    private String name;
    private String email;
    private Long bookingCount;
    private LocalDateTime createdAt;

}
