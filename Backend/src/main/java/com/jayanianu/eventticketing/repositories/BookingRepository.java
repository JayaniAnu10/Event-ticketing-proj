package com.jayanianu.eventticketing.repositories;

import com.jayanianu.eventticketing.entities.Booking;
import com.jayanianu.eventticketing.entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByBookingStatusAndReservedExpiryDateBefore(Status status, LocalDateTime now);

    List<Booking> findByUser_IdAndBookingStatus(Long userId, Status bookingStatus);

    Long countAllByBookingStatus(Status bookingStatus);

    List<Booking> findByEvent_Id(Long eventId);

    void deleteBookingsByEvent_Id(Long eventId);

    long countByUser_Id(Long userId);

    void deleteAllByUser_Id(Long userId);
}
