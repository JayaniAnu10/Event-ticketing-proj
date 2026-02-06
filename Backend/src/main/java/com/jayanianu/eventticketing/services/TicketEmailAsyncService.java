package com.jayanianu.eventticketing.services;

import com.jayanianu.eventticketing.entities.Booking;
import com.jayanianu.eventticketing.entities.Ticket;
import com.jayanianu.eventticketing.repositories.BookingRepository;
import com.jayanianu.eventticketing.repositories.TicketRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class TicketEmailAsyncService {

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final EmailService emailService;

    @Async
    @Transactional
    public void sendTicketsAsync(Long bookingId) {
        try {
            Booking booking = bookingRepository.findById(bookingId).orElseThrow();

            List<Ticket> tickets = ticketRepository.findByBooking_Id(bookingId);
            List<File> pdfFiles = new ArrayList<>();

            for (Ticket ticket : tickets) {
                File pdfFile = TicketPDFGeneratorService.generatePDF(booking, ticket);
                pdfFiles.add(pdfFile);
            }

            emailService.sendTicketEmail(
                    booking.getUser().getEmail(),
                    "Your Tickets For " + booking.getEvent().getName(),
                    "Your payment was successful! Please find your tickets attached.",
                    pdfFiles
            );

            System.out.println("✅ Async email sent for bookingId=" + bookingId);

        } catch (Exception e) {
            System.err.println("❌ Async email failed for bookingId=" + bookingId);
            e.printStackTrace();
        }
    }
}
