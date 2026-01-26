package com.jayanianu.eventticketing.controllers;

import com.itextpdf.text.DocumentException;
import com.jayanianu.eventticketing.dtos.TicketSelectionRequest;
import com.jayanianu.eventticketing.entities.Booking;
import com.jayanianu.eventticketing.entities.Ticket;
import com.jayanianu.eventticketing.repositories.*;
import com.jayanianu.eventticketing.services.BookingService;
import com.jayanianu.eventticketing.services.TicketPDFGeneratorService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


@RestController
@AllArgsConstructor
@RequestMapping("/booking")
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    @PostMapping("/{user_id}/{id}")
    public ResponseEntity<?> selectTickets(
            @PathVariable Long id,
            @PathVariable Long user_id,
            @RequestBody TicketSelectionRequest request){

        return bookingService.handleBooking(id,user_id,request);
    }

    @GetMapping("/getDetails/{id}")
    public ResponseEntity<?> getBookingDetails(@PathVariable Long id){
        return bookingService.getBookingDetails(id);
    }

    @GetMapping("/{bookingId}/download")
    public ResponseEntity<Resource> downloadTickets(@PathVariable Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        List<Ticket> tickets = ticketRepository.findByBooking_Id(bookingId);

        if (tickets.isEmpty()) {
            throw new RuntimeException("No tickets found for booking");
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (ZipOutputStream zos = new ZipOutputStream(baos)) {

            for (Ticket ticket : tickets) {

                File pdfFile = TicketPDFGeneratorService.generatePDF(
                        booking,
                        ticket
                );

                ZipEntry entry = new ZipEntry(
                        "ticket-" + ticket.getTicketCode() + ".pdf"
                );
                zos.putNextEntry(entry);

                Files.copy(pdfFile.toPath(), zos);
                zos.closeEntry();
            }

        } catch (IOException | DocumentException e) {
            throw new RuntimeException("Failed to generate tickets ZIP", e);
        }

        ByteArrayInputStream zipStream =
                new ByteArrayInputStream(baos.toByteArray());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=booking-" + bookingId + "-tickets.zip"
                )
                .body(new InputStreamResource(zipStream));
    }
}

