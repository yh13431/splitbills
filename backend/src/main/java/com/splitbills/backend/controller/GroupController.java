package com.splitbills.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.splitbills.backend.model.Group;
import com.splitbills.backend.service.GroupService;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    @GetMapping("/{id}")
    public Group getGroupById(@PathVariable Long id) {
        return groupService.getGroupById(id).orElseThrow(() -> new RuntimeException("Group not found"));
    }

    @PostMapping
    public Group createGroup(@RequestBody Group group) {
        return groupService.createGroup(group);
    }

    @PutMapping("/{id}")
    public Group updateGroup(@PathVariable Long id, @RequestBody Group group) {
        return groupService.updateGroup(id, group);
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
    public ResponseEntity<Group> addUserToGroup(@PathVariable Long groupId, @PathVariable Integer userId) {
        try {
            Group updatedGroup = groupService.addUserToGroup(groupId, userId);
            return ResponseEntity.ok(updatedGroup);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @DeleteMapping("/{groupId}/users/{userId}")
    public ResponseEntity<Group> removeUserFromGroup(@PathVariable Long groupId, @PathVariable Integer userId) {
        try {
            Group updatedGroup = groupService.removeUserFromGroup(groupId, userId);
            return ResponseEntity.ok(updatedGroup);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }
}