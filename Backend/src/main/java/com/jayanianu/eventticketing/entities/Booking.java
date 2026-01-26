package com.jayanianu.eventticketing.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "booking_date",insertable = false, updatable = false)
    private LocalDateTime bookingDate;

    @Column(name = "reserved_expiry_time")
    private LocalDateTime reservedExpiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status")
    private Status bookingStatus;

    @Column(name = "total_payment")
    private BigDecimal totalPayment;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "total_tickets")
    private Long totalTickets;

    @OneToMany(mappedBy = "booking")
    private Set<Ticket> tickets = new HashSet<>();


    @ManyToOne
    @JoinColumn(name = "event_ticket")
    private EventTicket eventTicket;

}