package com.splitbills.backend.service;

import com.splitbills.backend.model.Group;
import com.splitbills.backend.model.User;
import com.splitbills.backend.repository.GroupRepository;
import com.splitbills.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private GroupRepository groupRepository;

    @InjectMocks
    private UserService userService;

    public UserServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAllUsers() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");

        when(userRepository.findAll()).thenReturn(Collections.singletonList(user));

        var result = userService.allUsers();

        assertEquals(1, result.size());
        assertEquals("testUser", result.get(0).getUsername());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testFindUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");

        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));

        User result = userService.findUser(1L);

        assertEquals("testUser", result.getUsername());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testUpdateUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("updatedUser");

        when(userRepository.existsById(1L)).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.updateUser(1L, user);

        assertEquals("updatedUser", result.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUpdateUserNotFound() {
        User user = new User();
        user.setId(1L);

        when(userRepository.existsById(1L)).thenReturn(false);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUser(1L, user);
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testDeleteUser() {
        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));

        userService.deleteUser(1L);

        verify(userRepository, times(1)).delete(user);
    }

    @Test
    void testDeleteUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(java.util.Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            userService.deleteUser(1L);
        });

        assertEquals("User not found with id: 1", exception.getMessage());
    }

    @Test
    void testAddUserToGroup() {
        User user = new User();
        user.setId(1L);
        Group group = new Group();
        group.setId(1L);

        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));
        when(groupRepository.findById(1L)).thenReturn(java.util.Optional.of(group));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.addUserToGroup(1L, 1L);

        assertEquals(1, result.getGroups().size());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRemoveUserFromGroup() {
        User user = new User();
        user.setId(1L);
        Group group = new Group();
        group.setId(1L);
        user.getGroups().add(group);

        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));
        when(groupRepository.findById(1L)).thenReturn(java.util.Optional.of(group));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.removeUserFromGroup(1L, 1L);

        assertEquals(0, result.getGroups().size());
        verify(userRepository, times(1)).save(any(User.class));
    }
}
