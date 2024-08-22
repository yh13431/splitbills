package com.splitbills.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.splitbills.backend.model.Bill;
import com.splitbills.backend.model.Group;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByGroup(Group group);
    Optional<Bill> findByIdAndGroup(Long id, Group group);
}
