package com.jayanianu.eventticketing.controllers;

import com.jayanianu.eventticketing.dtos.EventDto;
import com.jayanianu.eventticketing.dtos.EventTicketDto;
import com.jayanianu.eventticketing.dtos.RequestEventAdd;
import com.jayanianu.eventticketing.entities.Event;
import com.jayanianu.eventticketing.mappers.EventMapper;
import com.jayanianu.eventticketing.repositories.EventRepository;
import com.jayanianu.eventticketing.services.EventService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/events")
public class EventController {
    private final EventService eventService;

    @GetMapping
    public List<EventDto> getEvents(
            @RequestParam(required=false) String category,
            @RequestParam(required=false) String location,
            @RequestParam(required=false) String name

    ){
        return eventService.getEvents(category, name, location);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventTicketDto> getEventById(@PathVariable Long id){
        EventTicketDto dto = eventService.getEventById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build(); // return 404 if not found
        }
        return ResponseEntity.ok(dto);
    }


}
