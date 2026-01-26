package com.jayanianu.eventticketing.services;

import com.jayanianu.eventticketing.dtos.BookingDetailsResponse;
import com.jayanianu.eventticketing.dtos.BookingResponse;
import com.jayanianu.eventticketing.dtos.HandleBookingResponse;
import com.jayanianu.eventticketing.dtos.TicketSelectionRequest;
import com.jayanianu.eventticketing.entities.Booking;
import com.jayanianu.eventticketing.entities.Status;
import com.jayanianu.eventticketing.entities.Ticket;
import com.jayanianu.eventticketing.exceptions.SoldOutException;
import com.jayanianu.eventticketing.repositories.*;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class BookingService {
    private final EventTicketRepository eventTicketRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    public ResponseEntity<?> handleBooking(Long ticketCategoryId, Long userId, TicketSelectionRequest request){
        var eventTicket= eventTicketRepository.findByTicketCategoryId_IdAndEventId_Id(ticketCategoryId,request.getEventId()).orElse(null);
        var event= eventRepository.findById(request.getEventId()).orElse(null);


        if(eventTicket==null || event==null){
            return  ResponseEntity.notFound().build() ;
        }


        if(eventTicket.getAvailableQty()==0){
            throw new SoldOutException("Sorry, this ticket category is sold out.");
        }

        eventTicket.setAvailableQty(eventTicket.getAvailableQty()-request.getQuantity());
        eventTicketRepository.save(eventTicket);

        long eventTicketNo =(event.getTotalSeats()-event.getAvailableSeats());
        event.setAvailableSeats(event.getAvailableSeats()-request.getQuantity());
        eventRepository.save(event);

        var user = userRepository.findById(userId).orElse(null);
        if(user==null){
            return ResponseEntity.notFound().build() ;
        }

        var total =eventTicket.getUnitPrice().multiply(BigDecimal.valueOf(request.getQuantity()));

        Booking booking = new Booking();
        booking.setBookingDate(LocalDateTime.now());
        booking.setEvent(event);
        booking.setUser(user);
        booking.setBookingStatus(Status.PENDING);
        booking.setTotalPayment(total);
        booking.setTotalTickets(request.getQuantity());
        booking.setEventTicket(eventTicket);
        booking.setReservedExpiryDate(LocalDateTime.now().plusMinutes(10));
        bookingRepository.save(booking);


        for (int i = 0; i < request.getQuantity(); i++) {
            Ticket ticket = new Ticket();
            ticket.setBooking(booking);
            ticket.setEvent(event);
            ticket.setTicketCategory(eventTicket.getTicketCategoryId());
            long seatNo = eventTicketNo + (i+1);
            ticket.setTicketCode("TICKET-" + booking.getId() + "-" + (i + 1)+"-"+seatNo);
            ticketRepository.save(ticket);
        }

        return ResponseEntity.ok().body(
                new HandleBookingResponse(
                        booking.getId(),
                        booking.getEvent().getName(),
                        booking.getBookingDate(),
                        booking.getTotalTickets(),
                        booking.getTotalPayment()

                )
        );
    }

    public ResponseEntity<?> getBookingDetails(Long id) {
        var booking= bookingRepository.findById(id).orElse(null);

        if(booking==null){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(
                new BookingDetailsResponse(
                        booking.getId(),
                        booking.getEvent().getName(),
                        booking.getEvent().getDescription(),
                        booking.getEvent().getLocation(),
                        booking.getTotalTickets(),
                        booking.getEventTicket().getTicketCategoryId().getType(),
                        booking.getEvent().getEventDate(),
                        booking.getTotalPayment(),
                        booking.getEvent().getImage()
                )
        );

    }
}
