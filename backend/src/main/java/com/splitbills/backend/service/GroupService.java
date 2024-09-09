package com.splitbills.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.splitbills.backend.model.Group;
import com.splitbills.backend.model.User;
import com.splitbills.backend.repository.GroupRepository;
import com.splitbills.backend.repository.UserRepository;

import jakarta.mail.MessagingException;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

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

    public Group addUserToGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        group.getUsers().add(user);
        user.getGroups().add(group);
        userRepository.save(user);

        Map<String, Object> variables = new HashMap<>();
        variables.put("username", user.getUsername());
        variables.put("groupName", group.getName());

        String template = "userAddedToGroup.html";
        String subject = "Welcome to Your New Group!";
        try {
            emailService.sendHtmlEmail(user.getEmail(), subject, variables, template);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        return groupRepository.save(group);
    }
    
    public Group removeUserFromGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    
        group.getUsers().remove(user);
        user.getGroups().remove(group);
        userRepository.save(user);
    
        return groupRepository.save(group);
    }
    
}