package com.jayanianu.eventticketing.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class EventCategoryRequest {
    private String name;
    private Integer totalSeats;
    private BigDecimal unitPrice;
}
