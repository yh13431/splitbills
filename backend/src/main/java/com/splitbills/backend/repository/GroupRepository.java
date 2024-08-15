package com.splitbills.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.splitbills.backend.model.Group;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

}
