package com.jayanianu.eventticketing.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {
    @NotNull(message = "Booking ID is required.")
    Long bookingId;
}
