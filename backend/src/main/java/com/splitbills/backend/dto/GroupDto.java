package com.splitbills.backend.dto;

import java.util.Set;

public class GroupDto {
    private Long id;
    private String name;
    private Set<Long> userIds;
    private Set<Long> billIds;

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
        return userIds;
    }

    public void setUsers(Set<Long> userIds) {
        this.userIds = userIds;
    }

    public Set<Long> getBills() {
        return billIds;
    }

    public void setBills(Set<Long> billIds) {
        this.billIds = billIds;
    }
}
