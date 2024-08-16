package com.splitbills.backend.controller;

import com.splitbills.backend.dto.UserDto;
import com.splitbills.backend.model.User;
import com.splitbills.backend.model.Group;
import com.splitbills.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api/users")
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        UserDto userDto = convertToDto(currentUser);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/")
    public ResponseEntity<List<UserDto>> allUsers() {
        List<User> users = userService.allUsers();
        List<UserDto> userDtos = users.stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findUser(@PathVariable Integer id) {
        User user = userService.findUser(id);
        UserDto userDto = convertToDto(user);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Integer id, @RequestBody UserDto userDto) {
        User user = convertToEntity(userDto);
        User updatedUser = userService.updateUser(id, user);
        UserDto updatedUserDto = convertToDto(updatedUser);
        return ResponseEntity.ok(updatedUserDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{userId}/groups/{groupId}")
    public ResponseEntity<UserDto> addUserToGroup(@PathVariable Integer userId, @PathVariable Long groupId) {
        try {
            User updatedUser = userService.addUserToGroup(userId, groupId);
            UserDto updatedUserDto = convertToDto(updatedUser);
            return ResponseEntity.ok(updatedUserDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @DeleteMapping("/{userId}/groups/{groupId}")
    public ResponseEntity<UserDto> removeUserFromGroup(@PathVariable Integer userId, @PathVariable Long groupId) {
        try {
            User updatedUser = userService.removeUserFromGroup(userId, groupId);
            UserDto updatedUserDto = convertToDto(updatedUser);
            return ResponseEntity.ok(updatedUserDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setGroups(user.getGroups().stream().map(Group::getId).collect(Collectors.toSet()));
        return dto;
    }

    private User convertToEntity(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword()); 
        user.setCreatedAt(userDto.getCreatedAt());
        user.setUpdatedAt(userDto.getUpdatedAt());
        return user;
    }
}
