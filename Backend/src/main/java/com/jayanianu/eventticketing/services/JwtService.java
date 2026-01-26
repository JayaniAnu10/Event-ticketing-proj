package com.jayanianu.eventticketing.services;

import com.jayanianu.eventticketing.config.JwtConfig;
import com.jayanianu.eventticketing.entities.Role;
import com.jayanianu.eventticketing.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;


@AllArgsConstructor
@Service
public class JwtService {
    private final JwtConfig jwtConfig;

    public String generateAccessToken(User user) {
        return generateToken(user,jwtConfig.getAccessTokenExpiration());
    }

    public String generateRefreshToken(User user) {
        return generateToken(user,jwtConfig.getRefreshTokenExpiration());
    }

    private String generateToken(User user,int tokenExpiration) {
        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("Email", user.getEmail())
                .claim("Name", user.getName())
                .claim("Role", user.getRole())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * tokenExpiration))
                .signWith(jwtConfig.getSecretKey())
                .compact();
    }

    public Jwt parseToken(String token) {
        try{
            var claims = getClaims(token);
            return  new Jwt(claims, jwtConfig.getSecretKey());
        }catch(JwtException e){
            return null;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(jwtConfig.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long getUserIdFromToken(String token){
        return Long.valueOf(getClaims(token).getSubject());
    }

    public Role getRoleFromToken(String token) {
        return Role.valueOf(getClaims(token).get("Role").toString());
    }
}
