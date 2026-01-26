package com.jayanianu.eventticketing.schedulers;

import com.jayanianu.eventticketing.entities.Status;
import com.jayanianu.eventticketing.repositories.BookingRepository;
import com.jayanianu.eventticketing.repositories.EventRepository;
import com.jayanianu.eventticketing.repositories.EventTicketRepository;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class ReservationScheduler {
   private final BookingRepository bookingRepository;
   private final EventTicketRepository eventTicketRepository;
   private final EventRepository eventRepository;

    // Run every 5 minute (300000 ms)
    @Scheduled(fixedRate = 300000)
    public void canceledExpiredBookings() {
        var expiredBookings = bookingRepository.findByBookingStatusAndReservedExpiryDateBefore(Status.PENDING, LocalDateTime.now());

        if (expiredBookings.isEmpty()) return;

        expiredBookings.forEach(booking -> {
            var ticket = booking.getEventTicket();
            var event = booking.getEvent();

            ticket.setAvailableQty(ticket.getAvailableQty() + booking.getTotalTickets());
            eventTicketRepository.save(ticket);

            event.setAvailableSeats(event.getAvailableSeats() + booking.getTotalTickets());
            eventRepository.save(event);

            booking.setBookingStatus(Status.CANCELLED);
            bookingRepository.save(booking);
        });
    }
}
