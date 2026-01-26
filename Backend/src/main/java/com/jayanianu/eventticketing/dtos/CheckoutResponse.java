package com.jayanianu.eventticketing.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckoutResponse {
    private Long bookingId;
    private String checkoutUrl;
}
