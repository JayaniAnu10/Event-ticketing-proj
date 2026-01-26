package com.jayanianu.eventticketing.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TicketCategoryDto {
    private Long id;
    private Long ticketCategoryId;
    private Long totalQty;
    private Long availableQty;
    private BigDecimal unitPrice;
    private String type;

}
