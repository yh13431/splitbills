package com.splitbills.backend.controller;

import com.splitbills.backend.dto.LoginUserDto;
import com.splitbills.backend.dto.RegisterUserDto;
import com.splitbills.backend.model.User;
import com.splitbills.backend.response.LoginResponse;
import com.splitbills.backend.service.AuthenticationService;
import com.splitbills.backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

public class AuthenticationControllerTest {

    @InjectMocks
    private AuthenticationController authenticationController;

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private JwtService jwtService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegister() {
        // Arrange
        RegisterUserDto registerUserDto = new RegisterUserDto();
        registerUserDto.setEmail("test@example.com");
        registerUserDto.setPassword("password");

        User registeredUser = new User();
        registeredUser.setId(1L);
        registeredUser.setEmail("test@example.com");

        when(authenticationService.signup(any(RegisterUserDto.class))).thenReturn(registeredUser);

        // Act
        ResponseEntity<User> response = authenticationController.register(registerUserDto);

        // Assert
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(registeredUser);
        verify(authenticationService, times(1)).signup(registerUserDto);
    }

    @Test
    public void testAuthenticate() {
        // Arrange
        LoginUserDto loginUserDto = new LoginUserDto();
        loginUserDto.setUsername("testusername");
        loginUserDto.setPassword("testpassword");

        User authenticatedUser = new User();
        authenticatedUser.setId(1L);
        authenticatedUser.setEmail("test@example.com");

        String jwtToken = "jwt.token.here";
        Long expiresIn = 3600L; // 1 hour

        when(authenticationService.authenticate(any(LoginUserDto.class))).thenReturn(authenticatedUser);
        when(jwtService.generateToken(authenticatedUser)).thenReturn(jwtToken);
        when(jwtService.getExpirationTime()).thenReturn(expiresIn);

        // Act
        ResponseEntity<LoginResponse> response = authenticationController.authenticate(loginUserDto);

        // Assert
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        LoginResponse loginResponse = response.getBody();
        assertThat(loginResponse).isNotNull();
        assertThat(loginResponse.getToken()).isEqualTo(jwtToken);
        assertThat(loginResponse.getExpiresIn()).isEqualTo(expiresIn);
        assertThat(loginResponse.getUserId()).isEqualTo(authenticatedUser.getId());

        verify(authenticationService, times(1)).authenticate(loginUserDto);
        verify(jwtService, times(1)).generateToken(authenticatedUser);
    }

    @Test
    public void testLogout() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);

        // Act
        ResponseEntity<String> response = authenticationController.logout(request);

        // Assert
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getHeaders().getFirst("Authorization")).isEqualTo("");
    }
}
