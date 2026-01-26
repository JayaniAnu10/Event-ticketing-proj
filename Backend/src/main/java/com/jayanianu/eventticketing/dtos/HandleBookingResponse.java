package com.jayanianu.eventticketing.dtos;

import com.jayanianu.eventticketing.entities.Status;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class HandleBookingResponse {
    private Long id;
    private String name;
    private LocalDateTime bookingDate;
    private Long totalTickets;
    private BigDecimal totalPayment;

}
