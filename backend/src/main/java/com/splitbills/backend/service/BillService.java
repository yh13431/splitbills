package com.splitbills.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.splitbills.backend.model.Bill;
import com.splitbills.backend.model.User;
import com.splitbills.backend.repository.BillRepository;

import jakarta.mail.MessagingException;

import com.splitbills.backend.model.Group;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private EmailService emailService;

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
    Bill savedBill = billRepository.save(bill);
    Group group = bill.getGroup();
    
    if (group != null) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("groupName", group.getName());
        variables.put("billName", savedBill.getName());
        variables.put("billAmount", savedBill.getPrice());
        User recipientUser = savedBill.getUser();
        variables.put("recipientUsername", recipientUser.getUsername());
        variables.put("recipientEmail", recipientUser.getEmail());


        String template = "billAddedToGroup.html";
        String subject = "New Bill Added to Your Group";
        
        group.getUsers().forEach(user -> {
            Map<String, Object> userVariables = new HashMap<>(variables);
            userVariables.put("username", user.getUsername());
            
            try {
                emailService.sendHtmlEmail(user.getEmail(), subject, userVariables, template);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        });
    }
    return savedBill;
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
