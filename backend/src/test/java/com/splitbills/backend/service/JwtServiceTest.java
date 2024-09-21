package com.splitbills.backend.service;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.security.Key;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtServiceTest {

    private JwtService jwtService;

    @Mock
    private UserDetails userDetails;

    private Key testKey;  

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        jwtService = new JwtService();

        testKey = Keys.secretKeyFor(SignatureAlgorithm.HS256); 
        setField(jwtService, "secretKey", java.util.Base64.getEncoder().encodeToString(testKey.getEncoded()));
        setField(jwtService, "jwtExpiration", 3600000L); 

        when(userDetails.getUsername()).thenReturn("testuser");
    }

    @Test
    void testExtractUsername() throws Exception {
        String token = jwtService.generateToken(userDetails);

        String username = jwtService.extractUsername(token);

        assertEquals("testuser", username);
    }

    @Test
    void testGenerateToken() throws Exception {
        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void testIsTokenValid() throws Exception {
        String token = jwtService.generateToken(userDetails);

        assertTrue(jwtService.isTokenValid(token, userDetails));
    }
    

    @Test
    void testExtractExpiration() throws Exception {
        String token = jwtService.generateToken(userDetails);

        Date expirationDate = (Date) invokePrivateMethod(jwtService, "extractExpiration", new Class<?>[]{String.class}, token);

        assertNotNull(expirationDate);
        assertTrue(expirationDate.after(new Date()));
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    private Object invokePrivateMethod(Object target, String methodName, Class<?>[] paramTypes, Object... params) throws Exception {
        Method method = target.getClass().getDeclaredMethod(methodName, paramTypes);
        method.setAccessible(true);
        return method.invoke(target, params);
    }
}
