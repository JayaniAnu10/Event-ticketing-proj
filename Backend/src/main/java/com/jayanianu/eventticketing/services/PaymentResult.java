package com.jayanianu.eventticketing.services;

import com.jayanianu.eventticketing.entities.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@AllArgsConstructor
public class PaymentResult {
    private Long bookingId;
    private Status paymentStatus;
    private String paymentId;

    public PaymentResult(Long bookingId, Status paymentStatus) {
        this.bookingId = bookingId;
        this.paymentStatus = paymentStatus;
    }
}
