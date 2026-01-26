package com.jayanianu.eventticketing.dtos;

import lombok.Data;

@Data
public class TicketSelectionRequest {
    private Long eventId;
    private Long quantity;
}
