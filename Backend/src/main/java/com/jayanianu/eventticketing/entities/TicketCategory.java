package com.jayanianu.eventticketing.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "ticket_category")
public class TicketCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "type")
    private String type;

    @OneToMany(mappedBy = "ticketCategory")
    private Set<Ticket> tickets = new HashSet<>();

    @OneToMany(mappedBy = "ticketCategoryId")
    private List<EventTicket> eventLinks;

}