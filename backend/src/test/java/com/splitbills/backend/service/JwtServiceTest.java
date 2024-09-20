package com.splitbills.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

    @Value("${security.jwt.secret-key}")
    private String secretKey = "mysecretkey1234567890";

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration = 10000;

    public JwtServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGenerateToken() {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("testUser");

        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        assertTrue(token.startsWith("eyJ"));
    }

    @Test
    void testExtractUsername() {
        UserDetails userDetails = mock(UserDetails.class);
        String token = jwtService.generateToken(userDetails);
        String username = jwtService.extractUsername(token);

        assertEquals("testUser", username);
    }

    @Test
    void testIsTokenValid() {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("testUser");
        String token = jwtService.generateToken(userDetails);

        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void testIsTokenExpired() {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("testUser");
        String token = jwtService.generateToken(userDetails);

        try {
            Thread.sleep(jwtExpiration + 1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        assertFalse(jwtService.isTokenValid(token, userDetails));
    }
}
