package com.jayanianu.eventticketing.repositories;

import com.jayanianu.eventticketing.entities.Event;
import com.jayanianu.eventticketing.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByBooking_Id(Long bookingId);

    void deleteByEvent(Event event);
}