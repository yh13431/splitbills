package com.splitbills.backend.dto;

import java.util.Set;

public class GroupDto {
    private Long id;
    private String name;
    private Set<Long> users;
    private Set<Long> bills;

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

    public Set<Long> getBills() {
        return bills;
    }

    public void setBills(Set<Long> bills) {
        this.bills = bills;
    }
}
