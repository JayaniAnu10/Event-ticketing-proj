package com.jayanianu.eventticketing.repositories;

import com.jayanianu.eventticketing.entities.Role;
import com.jayanianu.eventticketing.entities.User;
import io.micrometer.common.KeyValues;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    Long countAllByRole(Role role);

    List<User> findAllByRole(Role role);
}