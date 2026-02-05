package com.jayanianu.eventticketing.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.jayanianu.eventticketing.entities.Role;
import com.jayanianu.eventticketing.filters.JwtAuthenticationFilter;

import lombok.AllArgsConstructor;

@EnableWebSecurity
@Configuration
@AllArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        var provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http

                .sessionManagement(c ->
                        c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(c -> c
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/swagger-ui.html").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/refresh").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/logout").permitAll()
                        .requestMatchers(HttpMethod.POST, "/checkout").permitAll()
                        .requestMatchers(HttpMethod.POST, "/events").permitAll()
                        .requestMatchers(HttpMethod.GET, "/events").permitAll()
                        .requestMatchers(HttpMethod.GET, "/events/**").permitAll()
                        .requestMatchers("/admin/**").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/users/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/users/history").hasRole((Role.USER.name()))
                        .requestMatchers(HttpMethod.PUT, "/users/**").permitAll()
                        .requestMatchers("/assets/**").permitAll()
                        .requestMatchers(HttpMethod.POST,"/booking/**").permitAll()
                        .requestMatchers(HttpMethod.GET,"/booking/**").permitAll()
                        .requestMatchers(HttpMethod.POST,"/checkout/webhook").permitAll()
                        .anyRequest().authenticated()
                )
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(java.util.List.of(
                            "http://localhost:5173",
                            "http://localhost:3050",
                            "http://localhost:8080",
                            "http://143.110.177.255",
                            "http://eventra.jayanidahanayake.me"
                    ));
                    config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
                    config.setAllowedHeaders(java.util.List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .addFilterBefore(jwtAuthenticationFilter,UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(c -> {
                    c.authenticationEntryPoint(
                            new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
                    c.accessDeniedHandler(((request, response, accessDeniedException) ->
                            response.setStatus(HttpStatus.FORBIDDEN.value())));
                });

        return http.build();
    }
}
