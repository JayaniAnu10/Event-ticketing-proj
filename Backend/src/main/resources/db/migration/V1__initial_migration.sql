create table event
(
    id              bigint auto_increment
        primary key,
    name            varchar(255) not null,
    location        varchar(255) not null,
    description     text         not null,
    total_seats     bigint       not null,
    available_seats bigint       not null,
    event_date      datetime     not null,
    category        varchar(255) not null,
    image           text         null
);

create table users
(
    id         bigint auto_increment
        primary key,
    name       varchar(255)                           not null,
    email      varchar(255)                           not null,
    contact    varchar(10)                            not null,
    role       varchar(255) default 'USER'            not null,
    password   varchar(255)                           not null,
    created_at datetime     default CURRENT_TIMESTAMP not null
);

create table ticket_category
(
    id   bigint auto_increment
        primary key,
    type varchar(255) not null
);

create table event_ticket
(
    ticket_category_id bigint         not null,
    event_id           bigint         not null,
    total_qty          bigint         not null,
    available_qty      bigint         not null,
    unit_price         decimal(10, 2) not null,
    id                 bigint auto_increment
        primary key,
    constraint event_ticket_event_id_fk
        foreign key (event_id) references event (id)
            on update cascade on delete cascade,
    constraint event_ticket_ticket_category_id_fk
        foreign key (ticket_category_id) references ticket_category (id)
);


create table booking
(
    id                   bigint auto_increment
        primary key,
    event_id             bigint                   not null,
    user_id              bigint                   not null,
    booking_date         datetime default (now()) not null,
    booking_status       varchar(255)             not null,
    total_payment        decimal(10, 2)           not null,
    transaction_id       varchar(255)             null,
    total_tickets        bigint                   not null,
    event_ticket         bigint                   not null,
    reserved_expiry_time datetime                 null,
    constraint Booking_Event_id_fk
        foreign key (event_id) references event (id)
            on update cascade on delete cascade,
    constraint Booking_User_id_fk
        foreign key (user_id) references users (id)
            on update cascade on delete cascade,
    constraint booking_event_ticket_id_fk
        foreign key (event_ticket) references event_ticket (id)
            on update cascade on delete cascade
);

create table ticket
(
    id                 bigint auto_increment
        primary key,
    booking_id         bigint       not null,
    ticket_category_id bigint       not null,
    event_id           bigint       not null,
    ticket_code        varchar(255) not null,
    constraint Ticket_Booking_id_fk
        foreign key (booking_id) references booking (id)
            on update cascade on delete cascade,
    constraint Ticket_Event_id_fk
        foreign key (event_id) references event (id)
            on update cascade on delete cascade,
    constraint Ticket_Ticket_Category_id_fk
        foreign key (ticket_category_id) references ticket_category (id)
);

