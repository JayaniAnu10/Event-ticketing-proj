package com.jayanianu.eventticketing.controllers;

import com.jayanianu.eventticketing.dtos.*;
import com.jayanianu.eventticketing.mappers.EventMapper;
import com.jayanianu.eventticketing.repositories.*;
import com.jayanianu.eventticketing.services.AdminService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@AllArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard(){
       return adminService.dashboardStat();
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventTicketDto>> getEvents(){
        var events = eventRepository.findAllByOrderByNameAsc(); ;
        return ResponseEntity.ok(events.stream()
                .map(eventMapper::toEventDto).toList()
        );
    }

    @Transactional
    @DeleteMapping("/event/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id){
        return adminService.deleteEvent(id);
    }

    @GetMapping("/users")
    public List<AdminUserDetails> getAllUsers(
            @RequestParam(required=false) String q
    ) {
        return adminService.getUsers(q);
    }


    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        bookingRepository.deleteAllByUser_Id(id);
        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "/add",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addEvent(
            @Valid @RequestPart("event") RequestEventAdd request,
            @RequestPart(value = "image",required = false) MultipartFile image
    ){
        try{
            var eventDto = adminService.addEvent(request,image);
            return ResponseEntity.ok(eventDto);
        } catch(IOException e){
            return ResponseEntity.badRequest().body(Map.of("error","Failed to upload image"));
        }

    }

    @PatchMapping(path = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @Valid @RequestPart("event") RequestEventAdd request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ){
        try {
            var eventDto = adminService.updateEvent(id, request, image);
            return ResponseEntity.ok(eventDto);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Event not found"));
        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to upload image"));
        }

    }
}
