package com.splitbills.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.splitbills.backend.model.Bill;
import com.splitbills.backend.service.BillService;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:3000")
public class BillController {

    @Autowired
    private BillService billService;

    @GetMapping
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    public Bill getBillById(@PathVariable Long id) {
        return billService.getBillById(id).orElseThrow(() -> new RuntimeException("Bill not found"));
    }

    @PostMapping
    public Bill createBill(@RequestBody Bill bill) {
        return billService.createBill(bill);
    }

    @PutMapping("/{id}")
    public Bill updateBill(@PathVariable Long id, @RequestBody Bill bill) {
        return billService.updateBill(id, bill);
    }

    @DeleteMapping("/{id}")
    public String deleteBill(@PathVariable Long id) {
        try {
            billService.deleteBill(id);
            return "Bill deleted successfully";
        } catch (RuntimeException e) {
            return e.getMessage();
        }
    }
}
