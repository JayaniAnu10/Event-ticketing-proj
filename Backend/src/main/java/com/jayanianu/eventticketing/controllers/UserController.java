package com.jayanianu.eventticketing.controllers;

import com.jayanianu.eventticketing.dtos.*;
import com.jayanianu.eventticketing.entities.Booking;
import com.jayanianu.eventticketing.entities.Role;
import com.jayanianu.eventticketing.entities.Status;
import com.jayanianu.eventticketing.mappers.UserMapper;
import com.jayanianu.eventticketing.repositories.BookingRepository;
import com.jayanianu.eventticketing.repositories.EventRepository;
import com.jayanianu.eventticketing.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;


    @GetMapping("/{id}")
    public ResponseEntity<UserDetailsDto> getUserById(@PathVariable Long id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userMapper.toDetails(user));
    }

    @GetMapping
    public ResponseEntity<StatResponse> getStats() {
        var totEvents = eventRepository.count();
        var totUsers = userRepository.countAllByRole(Role.USER);
        return ResponseEntity.ok(userMapper.toStats(totUsers,totEvents));
    }

    @PostMapping
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody RegisterUserRequest request,
            UriComponentsBuilder uriBuilder
    ){
        if(userRepository.existsByEmail(request.getEmail())){
            return ResponseEntity.badRequest().body(
                    Map.of("email","Email already exists"));
        }

        var user=userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        var userDto = userMapper.toDto(user);
        var uri = uriBuilder.path("/users/{id}").buildAndExpand(userDto.getId()).toUri();
        return ResponseEntity.created(uri).body(userDto);

    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ){
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        userMapper.update(request,user);
        userRepository.save(user);

        return ResponseEntity.ok(userMapper.toDto(user));
    }


    @PostMapping("/{id}/change-password")
    public ResponseEntity<Void> changeUserPassword(
            @PathVariable Long id,
            @Valid @RequestBody ChangePasswordRequest request
    ){
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if(!passwordEncoder.matches(request.getOldPassword(),user.getPassword())){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<BookingResponse>> getBookingHistory(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userIdStr = authentication.getPrincipal().toString();
        Long userId = Long.valueOf(userIdStr);

        var user = userRepository.findById(userId).orElse(null);

        if(user == null){
            return ResponseEntity.notFound().build();
        }

        List<Booking> bookings =bookingRepository.findByUser_IdAndBookingStatus(userId, Status.CONFIRMED);
        List<BookingResponse> responses =bookings.stream()
                .map(booking -> new BookingResponse(
                        booking.getId(),
                        booking.getEvent().getName(),
                        booking.getBookingDate(),
                        booking.getEvent().getLocation(),
                        booking.getEvent().getEventDate(),
                        booking.getTotalTickets(),
                        booking.getTotalPayment(),
                        booking.getEventTicket().getTicketCategoryId().getType(),
                        booking.getEvent().getImage()
                        )).toList();
        return ResponseEntity.ok(responses);
    }
}
