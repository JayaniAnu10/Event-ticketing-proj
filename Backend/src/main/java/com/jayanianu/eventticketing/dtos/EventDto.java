package com.jayanianu.eventticketing.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
public class EventDto {
    private Long id;
    private String name;
    private String description;
    private String location;
    private LocalDateTime eventDate;
    private Long totalSeats;
    private String category;
    private Long availableSeats;
    private String image;
}
