package com.jayanianu.eventticketing.services;

import com.jayanianu.eventticketing.dtos.EventDto;
import com.jayanianu.eventticketing.entities.Event;
import com.jayanianu.eventticketing.mappers.EventMapper;
import com.jayanianu.eventticketing.repositories.EventRepository;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class EventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

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
}
