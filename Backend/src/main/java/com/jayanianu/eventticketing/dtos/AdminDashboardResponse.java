package com.jayanianu.eventticketing.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@Data
public class AdminDashboardResponse {
    private Long totEvents;
    private Long totUsers;
    private Long totBookings;
    private BigDecimal revenue;
    private List<UpcomingEventDto> upcomingEvents;
}
