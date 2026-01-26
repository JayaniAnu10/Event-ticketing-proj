package com.jayanianu.eventticketing.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "event_ticket")
public class EventTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event eventId;

    @ManyToOne
    @JoinColumn(name = "ticket_category_id")
    private TicketCategory ticketCategoryId;


    @Column(name = "total_qty")
    private Long totalQty;

    @Column(name = "available_qty")
    private Long availableQty;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

}