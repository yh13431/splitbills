package com.splitbills.backend.controller;

import com.splitbills.backend.dto.GroupDto;
import com.splitbills.backend.model.Group;
import com.splitbills.backend.service.GroupService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GroupControllerTest {

    @Mock
    private GroupService groupService;

    @InjectMocks
    private GroupController groupController;

    public GroupControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllGroups() {
        Group group1 = new Group();
        group1.setId(1L);
        group1.setName("Group 1");

        when(groupService.getAllGroups()).thenReturn(Arrays.asList(group1));

        var result = groupController.getAllGroups();

        assertEquals(1, result.size());
        assertEquals("Group 1", result.get(0).getName());
        verify(groupService, times(1)).getAllGroups();
    }

    @Test
    void testGetGroupById() {
        Group group = new Group();
        group.setId(1L);
        group.setName("Group 1");

        when(groupService.getGroupById(1L)).thenReturn(Optional.of(group));

        GroupDto result = groupController.getGroupById(1L);

        assertEquals("Group 1", result.getName());
        verify(groupService, times(1)).getGroupById(1L);
    }

    @Test
    void testCreateGroup() {
        GroupDto groupDto = new GroupDto();
        groupDto.setName("Group 1");

        Group group = new Group();
        group.setId(1L);
        group.setName("Group 1");

        when(groupService.createGroup(any(Group.class))).thenReturn(group);

        GroupDto result = groupController.createGroup(groupDto);

        assertEquals("Group 1", result.getName());
        verify(groupService, times(1)).createGroup(any(Group.class));
    }

    @Test
    void testUpdateGroup() {
        GroupDto groupDto = new GroupDto();
        groupDto.setName("Updated Group");

        Group group = new Group();
        group.setId(1L);
        group.setName("Updated Group");

        when(groupService.updateGroup(1L, any(Group.class))).thenReturn(group);

        GroupDto result = groupController.updateGroup(1L, groupDto);

        assertEquals("Updated Group", result.getName());
        verify(groupService, times(1)).updateGroup(1L, any(Group.class));
    }

    @Test
    void testDeleteGroup() {
        ResponseEntity<String> response = groupController.deleteGroup(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Group deleted successfully", response.getBody());
        verify(groupService, times(1)).deleteGroup(1L);
    }
}
