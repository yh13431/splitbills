package com.splitbills.backend.controller;

import com.splitbills.backend.dto.UserDto;
import com.splitbills.backend.model.User;
import com.splitbills.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Collections;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    public UserControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAuthenticatedUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");
        user.setEmail("test@example.com");
    
        Authentication authentication = mock(Authentication.class);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(authentication.getPrincipal()).thenReturn(user);
        ResponseEntity<UserDto> response = userController.authenticatedUser();
        assertEquals("testUser", response.getBody().getUsername());
    
    }
    

    @Test
    void testAllUsers() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");
        user.setEmail("test@example.com");

        when(userService.allUsers()).thenReturn(Collections.singletonList(user));

        ResponseEntity<List<UserDto>> response = userController.allUsers();

        assertEquals(1, response.getBody().size());
        assertEquals("testUser", response.getBody().get(0).getUsername());
        verify(userService, times(1)).allUsers();
    }

    @Test
    void testFindUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");
        user.setEmail("test@example.com");

        when(userService.findUser(1L)).thenReturn(user);

        ResponseEntity<UserDto> response = userController.findUser(1L);

        assertEquals("testUser", response.getBody().getUsername());
        verify(userService, times(1)).findUser(1L);
    }

    @Test
    void testUpdateUser() {
        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setUsername("updatedUser");

        User user = new User();
        user.setId(1L);
        user.setUsername("updatedUser");

        when(userService.updateUser(1L, user)).thenReturn(user);

        ResponseEntity<UserDto> response = userController.updateUser(1L, userDto);

        assertEquals("updatedUser", response.getBody().getUsername());
        verify(userService, times(1)).updateUser(1L, user);
    }

    @Test
    void testDeleteUser() {
        ResponseEntity<Void> response = userController.deleteUser(1L);

        verify(userService, times(1)).deleteUser(1L);
    }

    @Test
    void testAddUserToGroup() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");

        when(userService.addUserToGroup(1L, 1L)).thenReturn(user);

        ResponseEntity<UserDto> response = userController.addUserToGroup(1L, 1L);

        assertEquals("testUser", response.getBody().getUsername());
        verify(userService, times(1)).addUserToGroup(1L, 1L);
    }

    @Test
    void testRemoveUserFromGroup() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");

        when(userService.removeUserFromGroup(1L, 1L)).thenReturn(user);

        ResponseEntity<UserDto> response = userController.removeUserFromGroup(1L, 1L);

        assertEquals("testUser", response.getBody().getUsername());
        verify(userService, times(1)).removeUserFromGroup(1L, 1L);
    }
}
