package com.splitbills.backend.dto;

import java.util.Date;
import java.util.Set;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String password;
    private Date createdAt;
    private Date updatedAt;
    private Set<Long> groups;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<Long> getGroups() {
        return groups;
    }

    public void setGroups(Set<Long> groups) {
        this.groups = groups;
    }
}
