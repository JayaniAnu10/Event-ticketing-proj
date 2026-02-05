package com.jayanianu.eventticketing.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDto implements Serializable {
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
