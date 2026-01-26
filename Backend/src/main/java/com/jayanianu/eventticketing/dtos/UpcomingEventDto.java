package com.jayanianu.eventticketing.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UpcomingEventDto {
    private String name;
    private LocalDateTime date;
    private Long availableSeats;
    private String image;
}
