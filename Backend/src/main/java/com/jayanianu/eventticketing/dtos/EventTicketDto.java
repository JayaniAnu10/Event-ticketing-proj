package com.jayanianu.eventticketing.dtos;

import com.jayanianu.eventticketing.entities.Event;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class EventTicketDto implements Serializable {
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
