package com.jayanianu.eventticketing.mappers;

import com.jayanianu.eventticketing.dtos.*;
import com.jayanianu.eventticketing.entities.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(RegisterUserRequest request);
    UserDto toDto(User user);

    //if null values are passed with the request body , ignore those fields
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(UpdateUserRequest request,@MappingTarget User user);

    UserDetailsDto toDetails(User user);
}

