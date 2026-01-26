package com.jayanianu.eventticketing.dtos;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RequestEventAdd {
    private String name;
    private String description;
    private String location;
    private Long totalSeats;
    private Long availableSeats;
    private LocalDateTime eventDate;
    private String category;
    private List<EventCategoryRequest> ticketCategory;
}
