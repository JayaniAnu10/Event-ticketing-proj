package com.jayanianu.eventticketing.dtos;

import com.jayanianu.eventticketing.entities.Event;
import com.jayanianu.eventticketing.entities.EventTicket;
import com.jayanianu.eventticketing.entities.Status;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String name;
    private LocalDateTime bookingDate;
    private String location;
    private LocalDateTime eventDate;
    private Long totalTickets;
    private BigDecimal totalPayment;
    private String eventTicket;
    private String image;


}
