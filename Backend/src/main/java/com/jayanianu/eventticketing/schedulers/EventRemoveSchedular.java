package com.jayanianu.eventticketing.schedulers;

import com.jayanianu.eventticketing.repositories.EventRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EventRemoveSchedular {

    private final EventRepository eventRepository;

    public EventRemoveSchedular(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Scheduled(cron = "0 0 2 * * ?")
    public void removeEvents(){
        LocalDateTime eventDate = LocalDateTime.now().minusDays(1);
        var oldEvents=eventRepository.findAllByEventDateBefore(eventDate);

        if(oldEvents.isEmpty()){
            return;
        }
        eventRepository.deleteAll(oldEvents);
    }
}
