package com.jayanianu.eventticketing.services;


import com.jayanianu.eventticketing.dtos.CheckoutResponse;
import com.jayanianu.eventticketing.entities.Booking;

import java.util.Optional;


public interface PaymentGateway {
    CheckoutResponse createCheckoutSession(Booking booking);
    Optional<PaymentResult> parseWebhookRequest(WebhookRequest webhookRequest);
}
