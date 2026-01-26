package com.jayanianu.eventticketing.repositories;

import com.jayanianu.eventticketing.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByEventDateBefore(LocalDateTime eventDateBefore);
    List<Event> findAllByOrderByNameAsc();

    List<Event> findByEventDateAfter(LocalDateTime eventDateAfter);
}