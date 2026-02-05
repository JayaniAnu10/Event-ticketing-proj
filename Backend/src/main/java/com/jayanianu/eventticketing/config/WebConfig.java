package com.jayanianu.eventticketing.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("http://localhost:5173",
                                "http://localhost:3050","http://143.110.177.255","http://localhost:8080","http://eventra.jayanidahanayake.me")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                        .allowedHeaders("*")
                        .exposedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
