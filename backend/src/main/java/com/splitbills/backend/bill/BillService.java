package com.splitbills.backend.bill;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
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
