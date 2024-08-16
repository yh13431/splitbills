package com.splitbills.backend.dto;

import java.util.Set;

public class GroupDto {
    private Long id;
    private String name;
    private Set<Long> users;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Long> getUsers() {
        return users;
    }

    public void setUsers(Set<Long> users) {
        this.users = users;
    }
}
