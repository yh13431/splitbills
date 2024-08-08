package com.splitbills.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.splitbills.backend.model.Bill;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

}
