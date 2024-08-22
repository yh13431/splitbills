package com.splitbills.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.splitbills.backend.model.Bill;
import com.splitbills.backend.repository.BillRepository;
import com.splitbills.backend.model.Group;

import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }

    public List<Bill> getBillsByGroup(Group group) {
        return billRepository.findByGroup(group);
    }

    public Optional<Bill> getBillByIdAndGroup(Long id, Group group) {
        return billRepository.findByIdAndGroup(id, group);
    }

    public Bill createBill(Bill bill) {
        return billRepository.save(bill);
    }

    public Bill updateBill(Long id, Bill bill) {
        if (billRepository.existsById(id)) {
            bill.setId(id);
            return billRepository.save(bill);
        } else {
            throw new RuntimeException("Bill not found");
        }
    }

    public void deleteBill(Long id) {
        if (billRepository.existsById(id)) {
            billRepository.deleteById(id);
        } else {
            throw new RuntimeException("Bill not found");
        }
    }
}
