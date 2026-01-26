package com.jayanianu.eventticketing.repositories;

import com.jayanianu.eventticketing.dtos.EventCategoryRequest;
import com.jayanianu.eventticketing.entities.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.function.Function;

public interface TicketCategoryRepository extends JpaRepository<TicketCategory, Long> {
    Optional<TicketCategory> findByType(String type);
}