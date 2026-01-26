package com.jayanianu.eventticketing.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BookingDetailsResponse {
    private Long id;
    private String eventName;
    private String description;
    private String location;
    private Long quantity;
    private String ticketCategory;
    private LocalDateTime date;
    private BigDecimal total;
    private String image;
}
