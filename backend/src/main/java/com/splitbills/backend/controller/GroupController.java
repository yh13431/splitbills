package com.splitbills.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.splitbills.backend.dto.GroupDto;
import com.splitbills.backend.model.Bill;
import com.splitbills.backend.model.Group;
import com.splitbills.backend.model.User;
import com.splitbills.backend.service.GroupService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @GetMapping
    public List<GroupDto> getAllGroups() {
        List<Group> groups = groupService.getAllGroups();
        return groups.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public GroupDto getGroupById(@PathVariable Long id) {
        Group group = groupService.getGroupById(id).orElseThrow(() -> new RuntimeException("Group not found"));
        return convertToDto(group);
    }

    @PostMapping
    public GroupDto createGroup(@RequestBody GroupDto groupDto) {
        Group group = convertToEntity(groupDto);
        Group createdGroup = groupService.createGroup(group);
        return convertToDto(createdGroup);
    }

    @PutMapping("/{id}")
    public GroupDto updateGroup(@PathVariable Long id, @RequestBody GroupDto groupDto) {
        Group group = convertToEntity(groupDto);
        group.setId(id);
        Group updatedGroup = groupService.updateGroup(id, group);
        return convertToDto(updatedGroup);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long id) {
        try {
            groupService.deleteGroup(id);
            return ResponseEntity.ok("Group deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/{groupId}/users/{userId}")
    public ResponseEntity<GroupDto> addUserToGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        try {
            Group updatedGroup = groupService.addUserToGroup(groupId, userId);
            return ResponseEntity.ok(convertToDto(updatedGroup));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @DeleteMapping("/{groupId}/users/{userId}")
    public ResponseEntity<GroupDto> removeUserFromGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        try {
            Group updatedGroup = groupService.removeUserFromGroup(groupId, userId);
            return ResponseEntity.ok(convertToDto(updatedGroup));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    private GroupDto convertToDto(Group group) {
        GroupDto dto = new GroupDto();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setUsers(group.getUsers().stream().map(User::getId).collect(Collectors.toSet()));
        dto.setBills(group.getBills().stream().map(Bill::getId).collect(Collectors.toSet()));        
        return dto;
    }

    private Group convertToEntity(GroupDto dto) {
        Group group = new Group();
        group.setId(dto.getId());
        group.setName(dto.getName());
        return group;
    }
}