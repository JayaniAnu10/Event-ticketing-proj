package com.jayanianu.eventticketing.services;

import com.jayanianu.eventticketing.entities.Booking;
import com.jayanianu.eventticketing.entities.Ticket;
import com.jayanianu.eventticketing.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketEmailAsyncService {

    private final EmailService emailService;
    private final TicketRepository ticketRepository;

    @Async
    public void sendTicketsAsync(Booking booking) {
        try {
            List<Ticket> tickets = ticketRepository.findByBooking_Id(booking.getId());
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

            System.out.println(" Email sent successfully");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
