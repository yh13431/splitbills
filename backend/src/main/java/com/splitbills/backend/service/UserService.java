package com.splitbills.backend.service;

import com.splitbills.backend.model.Group;
import com.splitbills.backend.model.User;
import com.splitbills.backend.repository.GroupRepository;
import com.splitbills.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    public UserService(UserRepository userRepository, GroupRepository groupRepository) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }

    public User findUser(Integer id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    public User updateUser(Integer id, User user) {
        if (userRepository.existsById(id)) {
            user.setId(id);
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public User addUserToGroup(Integer userId, Long groupId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new EntityNotFoundException("Group not found with id: " + groupId));

        user.getGroups().add(group);
        return userRepository.save(user);
    }

    public User removeUserFromGroup(Integer userId, Long groupId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new EntityNotFoundException("Group not found with id: " + groupId));

        user.getGroups().remove(group);
        return userRepository.save(user);
    }
}
