package com.jayanianu.eventticketing.services;

import com.jayanianu.eventticketing.dtos.EventDto;
import com.jayanianu.eventticketing.dtos.EventTicketDto;
import com.jayanianu.eventticketing.entities.Event;
import com.jayanianu.eventticketing.mappers.EventMapper;
import com.jayanianu.eventticketing.repositories.EventRepository;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class EventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Cacheable(
            value = "events",
            key = "T(java.util.Objects).hash(#category, #name, #location)"
    )
    public List<EventDto> getEvents(String category, String name, String location){

        Sort sort=Sort.by(Sort.Direction.ASC, "name");
        return eventRepository.findAll(sort).stream()
                .filter(e -> category == null ||
                        (e.getCategory() != null && e.getCategory().equalsIgnoreCase(category)))
                .filter(e -> name == null ||
                        e.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(e -> location == null ||
                        (e.getLocation() != null && e.getLocation().equalsIgnoreCase(location)))
                .map(eventMapper::toDto)
                .toList();

    }

    @Cacheable(value = "event", key = "#id")
    public ResponseEntity<EventTicketDto> getEventById(Long id) {
        var event= eventRepository.findById(id).orElse(null);
        if(event==null) {
            return ResponseEntity.notFound().build();
        }
        EventTicketDto dto = eventMapper.toEventDto(event);
        return ResponseEntity.ok(dto);
    }
}
