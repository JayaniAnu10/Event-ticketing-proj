package com.jayanianu.eventticketing.services;

import com.jayanianu.eventticketing.dtos.*;
import com.jayanianu.eventticketing.entities.*;
import com.jayanianu.eventticketing.imageStorage.AzureImageStorageClient;
import com.jayanianu.eventticketing.mappers.EventMapper;
import com.jayanianu.eventticketing.repositories.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final EventRepository eventRepository;
    private final AzureImageStorageClient imageStorageClient;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final EventTicketRepository eventTicketRepository;
    private final TicketRepository ticketRepository;
    private final EventMapper eventMapper;
    private final TicketCategoryRepository ticketCategoryRepository;

    @Value("${imageContainer}")
    private String containerName;

    public ResponseEntity<AdminDashboardResponse> dashboardStat(){
        var totEvents = eventRepository.count();
        var totUsers = userRepository.countAllByRole(Role.USER);
        var totBookings = bookingRepository.countAllByBookingStatus(Status.CONFIRMED);
        var revenue = BigDecimal.valueOf(totBookings * 100);
        var events = eventRepository.findByEventDateAfter(LocalDateTime.now());
        var upcomingEvents= events.stream().map(event -> new UpcomingEventDto(
                        event.getName(),
                        event.getEventDate(),
                        event.getAvailableSeats(),
                        event.getImage()
                ))
                .toList();

        return  ResponseEntity.ok(new AdminDashboardResponse(totEvents,totUsers,totBookings,revenue,upcomingEvents));
    }

    @CacheEvict(value = { "events", "event" }, allEntries = true)
    public ResponseEntity<Void> deleteEvent(Long id){
        var event = eventRepository.findById(id).orElse(null);
        if(event == null){
            return ResponseEntity.notFound().build();
        }

        var oldImageUrl = event.getImage();
        bookingRepository.deleteBookingsByEvent_Id(id);
        eventTicketRepository.deleteByEventId(event);
        ticketRepository.deleteByEvent(event);
        eventRepository.deleteById(id);

        if (oldImageUrl!= null) {
            imageStorageClient.deleteImage(oldImageUrl);
        }

        return ResponseEntity.noContent().build();

    }

    public List<AdminUserDetails> getUsers(String q){

        return userRepository.findAllByRole(Role.USER).stream()
                .filter(u -> q == null || q.isEmpty() ||
                        u.getName().toLowerCase().contains(q.toLowerCase()) ||
                        u.getEmail().toLowerCase().contains(q.toLowerCase()))
                .map(user -> {
                    long bookingCount = bookingRepository.countByUser_Id(user.getId());

                    return new AdminUserDetails(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            bookingCount,
                            user.getCreatedAt()
                    );
                })
                .toList();

    }

    @CacheEvict(value = { "events", "event" }, allEntries = true)
    @Transactional
    public EventDto addEvent(@Valid RequestEventAdd request,
                                  MultipartFile image) throws IOException {

        var event =eventMapper.toEntity(request);
        event.setAvailableSeats(request.getTotalSeats());

        if(image!=null && !image.isEmpty()){
            uploadImage(image, event);
        }

        var savedEvent= eventRepository.save(event);

        for (EventCategoryRequest categoryRequest : request.getTicketCategory()) {

            TicketCategory ticketCategory = ticketCategoryRepository
                    .findByType(categoryRequest.getName())
                    .orElseGet(() -> {
                        TicketCategory newCategory = new TicketCategory();
                        newCategory.setType(categoryRequest.getName());
                        return ticketCategoryRepository.save(newCategory);
                    });

            EventTicket eventTicket = getEventTicket(categoryRequest, savedEvent, ticketCategory);

            eventTicketRepository.save(eventTicket);
        }

        return eventMapper.toDto(savedEvent);
    }

    private void uploadImage(MultipartFile image, Event event) throws IOException {
        String originalFilename = image.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "unknown_file.jpg";
        }

        try(InputStream inputStream= image.getInputStream()){
            String contentType = image.getContentType();
            String imageUrl= imageStorageClient.uploadImage(containerName, originalFilename,inputStream,contentType);
            event.setImage(imageUrl);
        }
    }

    @CacheEvict(value = { "events", "event" }, allEntries = true)
    @Transactional
    public EventDto  updateEvent(Long id, @Valid RequestEventAdd request, MultipartFile image) throws IOException {
        Event event = eventRepository.findById(id).orElseThrow();
        var oldImageUrl = event.getImage();

         eventMapper.update(request,event);

        if (image != null && !image.isEmpty()) {
            uploadImage(image, event);
            if(oldImageUrl != null){
                imageStorageClient.deleteImage(oldImageUrl);
            }
        }

        // Add/update tickets from request
        if(request.getTicketCategory()!=null){
            for (EventCategoryRequest reqCat : request.getTicketCategory()) {
                TicketCategory category = ticketCategoryRepository.findByType(reqCat.getName())
                        .orElseGet(() -> {
                            TicketCategory newCategory = new TicketCategory();
                            newCategory.setType(reqCat.getName());
                            return ticketCategoryRepository.save(newCategory);
                        });

                EventTicket existing = eventTicketRepository
                        .findByEventIdAndTicketCategoryId(event, category);

                if (existing != null) {
                    existing.setTotalQty(reqCat.getTotalSeats().longValue());
                    existing.setAvailableQty(reqCat.getTotalSeats().longValue());
                    existing.setUnitPrice(reqCat.getUnitPrice());
                    eventTicketRepository.save(existing);
                } else {
                    EventTicket newTicket = getEventTicket(reqCat, event, category);
                    eventTicketRepository.save(newTicket);
                }
            }
        }

        Event updated = eventRepository.save(event);
        return eventMapper.toDto(updated);
    }

    private static EventTicket getEventTicket(EventCategoryRequest reqCat, Event event, TicketCategory category) {
        EventTicket newTicket = new EventTicket();
        newTicket.setEventId(event);
        newTicket.setTicketCategoryId(category);
        newTicket.setTotalQty(reqCat.getTotalSeats().longValue());
        newTicket.setAvailableQty(reqCat.getTotalSeats().longValue());
        newTicket.setUnitPrice(reqCat.getUnitPrice());
        return newTicket;
    }
}
