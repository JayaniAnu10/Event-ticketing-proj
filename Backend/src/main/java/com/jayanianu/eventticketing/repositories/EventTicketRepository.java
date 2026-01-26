package com.jayanianu.eventticketing.repositories;

import com.jayanianu.eventticketing.entities.Event;
import com.jayanianu.eventticketing.entities.EventTicket;
import com.jayanianu.eventticketing.entities.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface EventTicketRepository extends JpaRepository<EventTicket, Long> {
   Optional<EventTicket> findByTicketCategoryId_IdAndEventId_Id(Long ticketCategoryId, Long eventId);

    void deleteByEventId(Event eventId);

    EventTicket findByEventIdAndTicketCategoryId(Event event, TicketCategory category);

}