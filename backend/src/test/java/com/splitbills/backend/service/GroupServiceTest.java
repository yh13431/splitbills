package com.splitbills.backend.service;

import com.splitbills.backend.model.Group;
import com.splitbills.backend.model.User;
import com.splitbills.backend.repository.GroupRepository;
import com.splitbills.backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GroupServiceTest {

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private GroupService groupService;

    public GroupServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllGroups() {
        Group group = new Group();
        group.setId(1L);
        group.setName("Group 1");

        when(groupRepository.findAll()).thenReturn(Collections.singletonList(group));

        var result = groupService.getAllGroups();

        assertEquals(1, result.size());
        assertEquals("Group 1", result.get(0).getName());
        verify(groupRepository, times(1)).findAll();
    }

    @Test
    void testGetGroupById() {
        Group group = new Group();
        group.setId(1L);
        group.setName("Group 1");

        when(groupRepository.findById(1L)).thenReturn(Optional.of(group));

        Optional<Group> result = groupService.getGroupById(1L);

        assertTrue(result.isPresent());
        assertEquals("Group 1", result.get().getName());
        verify(groupRepository, times(1)).findById(1L);
    }

    @Test
    void testCreateGroup() {
        Group group = new Group();
        group.setName("Group 1");

        when(groupRepository.save(any(Group.class))).thenReturn(group);

        Group result = groupService.createGroup(group);

        assertEquals("Group 1", result.getName());
        verify(groupRepository, times(1)).save(any(Group.class));
    }

    @Test
    void testUpdateGroup() {
        Group group = new Group();
        group.setId(1L);
        group.setName("Updated Group");

        when(groupRepository.existsById(1L)).thenReturn(true);
        when(groupRepository.save(any(Group.class))).thenReturn(group);

        Group result = groupService.updateGroup(1L, group);

        assertEquals("Updated Group", result.getName());
        verify(groupRepository, times(1)).save(any(Group.class));
    }

    @Test
    void testDeleteGroup() {
        when(groupRepository.existsById(1L)).thenReturn(true);

        groupService.deleteGroup(1L);

        verify(groupRepository, times(1)).deleteById(1L);
    }

    @Test
    void testAddUserToGroup() throws MessagingException {
        Group group = new Group();
        group.setId(1L);
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");
        user.setUsername("User1");

        when(groupRepository.findById(1L)).thenReturn(Optional.of(group));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(groupRepository.save(any(Group.class))).thenReturn(group);

        Group result = groupService.addUserToGroup(1L, 1L);

        assertEquals(1, result.getUsers().size());
        verify(emailService, times(1)).sendHtmlEmail(eq(user.getEmail()), anyString(), anyMap(), anyString());
    }

    @Test
    void testRemoveUserFromGroup() {
        Group group = new Group();
        group.setId(1L);
        User user = new User();
        user.setId(1L);

        when(groupRepository.findById(1L)).thenReturn(Optional.of(group));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(groupRepository.save(any(Group.class))).thenReturn(group);

        Group result = groupService.removeUserFromGroup(1L, 1L);

        assertEquals(0, result.getUsers().size());
        verify(groupRepository, times(1)).save(any(Group.class));
    }
}
