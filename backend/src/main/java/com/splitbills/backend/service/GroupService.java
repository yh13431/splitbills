package com.splitbills.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.splitbills.backend.model.Group;
import com.splitbills.backend.model.User;
import com.splitbills.backend.repository.GroupRepository;
import com.splitbills.backend.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    public Group updateGroup(Long id, Group group) {
        if (groupRepository.existsById(id)) {
            group.setId(id);
            return groupRepository.save(group);
        } else {
            throw new RuntimeException("Group not found");
        }
    }

    public void deleteGroup(Long id) {
        if (groupRepository.existsById(id)) {
            groupRepository.deleteById(id);
        } else {
            throw new RuntimeException("Group not found");
        }
    }

    public Group addUserToGroup(Long groupId, Integer userId) {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        group.getUsers().add(user);
        return groupRepository.save(group);
    }

    public Group removeUserFromGroup(Long groupId, Integer userId) {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        group.getUsers().remove(user);
        return groupRepository.save(group);
    }
}