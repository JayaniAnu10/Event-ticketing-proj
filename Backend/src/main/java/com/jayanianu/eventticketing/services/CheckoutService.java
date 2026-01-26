package com.jayanianu.eventticketing.services;

import com.jayanianu.eventticketing.dtos.CheckoutRequest;
import com.jayanianu.eventticketing.dtos.CheckoutResponse;
import com.jayanianu.eventticketing.entities.Status;
import com.jayanianu.eventticketing.entities.Ticket;
import com.jayanianu.eventticketing.exceptions.BookingNotFoundException;
import com.jayanianu.eventticketing.exceptions.PDFGenerationException;
import com.jayanianu.eventticketing.exceptions.PaymentException;
import com.jayanianu.eventticketing.repositories.BookingRepository;
import com.jayanianu.eventticketing.repositories.TicketRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.File;
import java.util.ArrayList;
import java.util.List;


@RequiredArgsConstructor
@Service
public class CheckoutService {
    private final BookingRepository bookingRepository;
    private final PaymentGateway paymentGateway;
    private final EmailService emailService;
    private final TicketRepository ticketRepository;


    @Transactional
    public CheckoutResponse checkout(@Valid CheckoutRequest request){
        var booking = bookingRepository.findById(request.getBookingId()).orElse(null);
        if (booking == null) {
            throw new BookingNotFoundException("Booking not found");
        }

        try{
            var session = paymentGateway.createCheckoutSession(booking);
            return new CheckoutResponse(booking.getId(),session.getCheckoutUrl());

        } catch (PaymentException ex) {
            bookingRepository.deleteById(request.getBookingId());
            throw ex;
        }

    }

    public void handleWebhookRequest(WebhookRequest request){
        System.out.println("Webhook received from Stripe!");
        paymentGateway
                .parseWebhookRequest(request)
                .ifPresent(paymentResult ->{
                            var booking = bookingRepository.findById(paymentResult.getBookingId()).orElseThrow();

                    if (booking.getBookingStatus() == Status.CONFIRMED) {
                        System.out.println("Booking already processed. Skipping...");
                        return;
                    }
                            System.out.println("Booking before update: " + booking.getBookingStatus());

                            List<Ticket> tickets = ticketRepository.findByBooking_Id(booking.getId());
                            booking.setBookingStatus(paymentResult.getPaymentStatus());
                            booking.setTransactionId(paymentResult.getPaymentId());
                            bookingRepository.save(booking);

                            List<File> pdfFiles = new ArrayList<>();

                            try {
                                for(Ticket ticket:tickets) {
                                    File pdfFile = TicketPDFGeneratorService.generatePDF(booking, ticket);
                                    pdfFiles.add(pdfFile);
                                }
                                    emailService.sendTicketEmail(
                                            booking.getUser().getEmail(),
                                            "Your Tickets For "+booking.getEvent().getName(),
                                            "Your payment was successful! Please find your tickets attached.",
                                            pdfFiles
                                    );


                                System.out.println("PDF Generated Successfully");
                            } catch (Exception e) {
                                 throw new PDFGenerationException(e.getMessage());
                            }
                        }
                );


    }
}
