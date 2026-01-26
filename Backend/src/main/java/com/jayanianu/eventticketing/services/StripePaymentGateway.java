package com.jayanianu.eventticketing.services;

import com.jayanianu.eventticketing.dtos.CheckoutResponse;
import com.jayanianu.eventticketing.entities.Booking;
import com.jayanianu.eventticketing.entities.Status;
import com.jayanianu.eventticketing.exceptions.PaymentException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class StripePaymentGateway implements PaymentGateway {
    @Value("${websiteUrl}")
    private String websiteUrl;

    @Value("${stripe.webhookSecretKey}")
    private String webhookSecretKey;

    @Override
    public CheckoutResponse createCheckoutSession(Booking booking) {
        try{

            if (booking.getTickets() == null || booking.getTickets().isEmpty()) {
                throw new PaymentException("No tickets found for this booking.");
            }

            var builder = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(websiteUrl + "/checkout-success?booking_id=" + booking.getId())
                    .setCancelUrl(websiteUrl + "/checkout-cancel")
                    .putMetadata("booking_id", booking.getId().toString())
                    .setPaymentIntentData(
                            SessionCreateParams.PaymentIntentData.builder()
                                    .putMetadata("booking_id", booking.getId().toString())
                                    .build()
                    );

            BigDecimal ticketPrice = booking.getEventTicket().getUnitPrice().multiply(BigDecimal.valueOf(100)); // e.g. 2000.25

            var lineItem = SessionCreateParams.LineItem.builder()
                    .setQuantity(booking.getTotalTickets())
                    .setPriceData(
                            createPriceData(booking,ticketPrice)
                    ).build();

            BigDecimal serviceFeeCents = new BigDecimal("10000"); // 100 LKR in cents
            var serviceFeeLineItem = SessionCreateParams.LineItem.builder()
                    .setQuantity(1L) // only once per booking
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("lkr")
                                    .setUnitAmountDecimal(serviceFeeCents)
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName("Service Fee")
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            builder.addLineItem(lineItem);
            builder.addLineItem(serviceFeeLineItem);

            var session = Session.create(builder.build());
            return new CheckoutResponse(booking.getId(),session.getUrl());

        }catch (StripeException ex){
            throw new PaymentException(ex.getMessage());
        }

    }

    @Override
    public Optional<PaymentResult> parseWebhookRequest(WebhookRequest webhookRequest) {
        try {
            var payload = webhookRequest.getPayload();
            var signature = webhookRequest.getHeaders().get("stripe-signature");
            var event = Webhook.constructEvent(payload,signature,webhookSecretKey);
            System.out.println(event.getType());

            return switch (event.getType()) {
                case "payment_intent.succeeded" ->
                        Optional.of(new PaymentResult(extractBookingId(event), Status.CONFIRMED, extractPaymentId(event)));
                case "payment_intent.payment_failed" ->
                    Optional.of(new PaymentResult(extractBookingId(event),Status.CANCELLED));
                default -> Optional.empty();
            };


        } catch (SignatureVerificationException e) {
            throw new PaymentException("Invalid Signature");
        }
    }


    private SessionCreateParams.LineItem.PriceData createPriceData(Booking booking, BigDecimal totalPrice) {
        // LKR requires integer amounts
        return SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency("lkr")
                .setUnitAmountDecimal(totalPrice)
                .setProductData(
                        createProductData(booking)
                ).build();
    }

    private SessionCreateParams.LineItem.PriceData.ProductData createProductData(Booking booking) {
        return SessionCreateParams.LineItem.PriceData.ProductData.builder()
                .setName(booking.getEvent().getName())
                .build();
    }

    public Long extractBookingId(Event event){
        var stripeObject = event.getDataObjectDeserializer().getObject().orElseThrow(
                ()-> new PaymentException("Could not deserialize event")
        );

        if (stripeObject instanceof Session session) {
            return Long.valueOf(session.getMetadata().get("booking_id")); // Metadata on Session
        } else if (stripeObject instanceof PaymentIntent paymentIntent) {
            return Long.valueOf(paymentIntent.getMetadata().get("booking_id")); // Metadata on PI
        }
        throw new PaymentException("Unknown object type");
    }

    public String extractPaymentId(Event event){
        var stripeObject = event.getDataObjectDeserializer().getObject().orElseThrow(
                ()-> new PaymentException("Could not deserialize event")
        );

        if (stripeObject instanceof Session session) {
            return session.getPaymentIntent(); // Returns the PaymentIntent ID string
        } else if (stripeObject instanceof PaymentIntent pi) {
            return pi.getId();
        }
        return null;
    }

}
