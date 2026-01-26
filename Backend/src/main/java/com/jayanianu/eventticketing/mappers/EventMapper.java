package com.jayanianu.eventticketing.mappers;

import com.jayanianu.eventticketing.dtos.EventDto;
import com.jayanianu.eventticketing.dtos.EventTicketDto;
import com.jayanianu.eventticketing.dtos.RequestEventAdd;
import com.jayanianu.eventticketing.dtos.TicketCategoryDto;
import com.jayanianu.eventticketing.entities.Event;
import com.jayanianu.eventticketing.entities.EventTicket;
import jakarta.validation.Valid;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface EventMapper {
    Event toEntity(RequestEventAdd requestEvent);
    EventDto toDto(Event event);

    @Mapping(target = "ticketCategories" , source = "eventTicketsCategories")
    @Mapping(target = "image", source = "image")
    EventTicketDto toEventDto(Event event);

    @Mapping(target="type",source="ticketCategoryId.type")
    @Mapping(target = "ticketCategoryId", source = "ticketCategoryId.id")   // ticket category ID
    @Mapping(target = "id", source = "id") // event ticket id
    TicketCategoryDto toTicketCategoryDto(EventTicket event);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(RequestEventAdd request,@MappingTarget Event event);
}

