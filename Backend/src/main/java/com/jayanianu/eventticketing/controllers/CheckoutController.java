package com.jayanianu.eventticketing.controllers;

import com.jayanianu.eventticketing.dtos.CheckoutRequest;
import com.jayanianu.eventticketing.dtos.CheckoutResponse;
import com.jayanianu.eventticketing.repositories.BookingRepository;
import com.jayanianu.eventticketing.services.CheckoutService;
import com.jayanianu.eventticketing.services.WebhookRequest;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/checkout")
public class CheckoutController {
    private final CheckoutService checkoutService;

    @PostMapping
    public CheckoutResponse checkout(@Valid @RequestBody CheckoutRequest request){
        return checkoutService.checkout(request);
    }

    @PostMapping("/webhook")
    public void handleWebhook(
            @RequestHeader Map<String,String> headers,
            @RequestBody String payload
    ){
        checkoutService.handleWebhookRequest(new WebhookRequest(headers,payload));
    }
}
