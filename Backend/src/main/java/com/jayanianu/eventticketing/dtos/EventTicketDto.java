package com.jayanianu.eventticketing.dtos;

import com.jayanianu.eventticketing.entities.Event;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class EventTicketDto {
    private Long id;
    private String name;
    private String description;
    private String location;
    private LocalDate eventDate;
    private Long totalSeats;
    private String category;
    private Long availableSeats;
    private String image;

    private List<TicketCategoryDto> ticketCategories;
}
