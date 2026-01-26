package com.jayanianu.eventticketing.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@Entity
@Table(name = "event")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "description")
    private String description;

    @Column(name = "total_seats")
    private Long totalSeats;

    @Column(name = "available_seats")
    private Long availableSeats;

    @Column(name = "event_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime eventDate;

    @Column(name = "category")
    private String category;

    @Column(name = "image")
    private String image;

    @OneToMany(mappedBy = "event")
    private Set<Booking> bookings = new HashSet<>();

    @OneToMany(mappedBy = "event")
    private Set<Ticket> tickets = new HashSet<>();

    @OneToMany(mappedBy = "eventId", cascade = CascadeType.ALL)
    private List<EventTicket> eventTicketsCategories;

}