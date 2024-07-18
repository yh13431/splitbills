package com.splitbills.backend.bill;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/bills")
public class BillController {

  @Autowired
  private BillRepository billRepository;

  @GetMapping
  public List<Bill> getAllBills() {
    return billRepository.findAll();
  } 

  @GetMapping("/{id}")
  public Bill getBillById(@PathVariable Long id) {
    return billRepository.findById(id).get();
  }

  @PostMapping
  public Bill createBill(@RequestBody Bill bill) {
    return billRepository.save(bill);
  }

  @PutMapping("/{id}")
  public Bill updateBill(@PathVariable Long id, @RequestBody Bill bill) {
    Bill existingBill = billRepository.findById(id).get();
    existingBill.setName(bill.getName());
    existingBill.setPrice(bill.getPrice());
    existingBill.setQuantity(bill.getQuantity());
    return billRepository.save(existingBill);
  }

  @DeleteMapping("/{id}")
  public String deleteBill(@PathVariable Long id) {
    try {
      billRepository.findById(id).get();
      billRepository.deleteById(id);
      return "Bill deleted successfully";
    } catch (Exception e) {
      return "Bill not found";
    }
  }
}
