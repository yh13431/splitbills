package com.splitbills.backend.service;

import com.splitbills.backend.dto.LoginUserDto;
import com.splitbills.backend.dto.RegisterUserDto;
import com.splitbills.backend.model.User;
import com.splitbills.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

public class AuthenticationServiceTest {

    @InjectMocks
    private AuthenticationService authenticationService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSignup() {
        // Arrange
        RegisterUserDto registerUserDto = new RegisterUserDto();
        registerUserDto.setUsername("testUser");
        registerUserDto.setEmail("test@example.com");
        registerUserDto.setPassword("password");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("testUser");
        savedUser.setEmail("test@example.com");
        savedUser.setPassword("encodedPassword");

        when(passwordEncoder.encode(registerUserDto.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        User result = authenticationService.signup(registerUserDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getUsername()).isEqualTo("testUser");
        assertThat(result.getEmail()).isEqualTo("test@example.com");
        verify(passwordEncoder, times(1)).encode(registerUserDto.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testAuthenticate() {
    // Arrange
    LoginUserDto loginUserDto = new LoginUserDto();
    loginUserDto.setUsername("testUser");
    loginUserDto.setPassword("password");

    User foundUser = new User();
    foundUser.setId(1L);
    foundUser.setUsername("testUser");

    // Mock successful authentication
    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(null); // No need to return anything for a void method
    when(userRepository.findByUsername(loginUserDto.getUsername())).thenReturn(Optional.of(foundUser));

    // Act
    User result = authenticationService.authenticate(loginUserDto);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.getId()).isEqualTo(1L);
    assertThat(result.getUsername()).isEqualTo("testUser");
    verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    verify(userRepository, times(1)).findByUsername(loginUserDto.getUsername());
}

    @Test
    public void testAuthenticateUserNotFound() {
        // Arrange
        LoginUserDto loginUserDto = new LoginUserDto();
        loginUserDto.setUsername("nonExistentUser");
        loginUserDto.setPassword("password");

        // Mock successful authentication
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null); // Again, no return value needed for the void method
        when(userRepository.findByUsername(loginUserDto.getUsername())).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authenticationService.authenticate(loginUserDto);
        });

        assertThat(exception).isInstanceOf(RuntimeException.class);

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).findByUsername(loginUserDto.getUsername());
    }
}
