package com.splitbills.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.splitbills.backend.dto.BillDto;
import com.splitbills.backend.model.Bill;
import com.splitbills.backend.model.Group;
import com.splitbills.backend.service.BillService;
import com.splitbills.backend.service.GroupService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups/{groupId}/bills")
@CrossOrigin(origins = "http://localhost:3000")
public class BillController {

    @Autowired
    private BillService billService;
    
    @Autowired
    private GroupService groupService;

    @GetMapping
    public List<BillDto> getAllBills(@PathVariable Long groupId) {
        Group group = groupService.getGroupById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        return billService.getBillsByGroup(group).stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public BillDto getBillById(@PathVariable Long groupId, @PathVariable Long id) {
        Group group = groupService.getGroupById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        Bill bill = billService.getBillByIdAndGroup(id, group).orElseThrow(() -> new RuntimeException("Bill not found"));
        return convertToDto(bill);
    }

    @PostMapping
    public BillDto createBill(@PathVariable Long groupId, @RequestBody BillDto billDto) {
        Group group = groupService.getGroupById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        Bill bill = convertToEntity(billDto, group);
        Bill createdBill = billService.createBill(bill);
        return convertToDto(createdBill);
    }

    @PutMapping("/{id}")
    public BillDto updateBill(@PathVariable Long groupId, @PathVariable Long id, @RequestBody BillDto billDto) {
        Group group = groupService.getGroupById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        Bill bill = convertToEntity(billDto, group);
        Bill updatedBill = billService.updateBill(id, bill);
        return convertToDto(updatedBill);
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

    private BillDto convertToDto(Bill bill) {
        BillDto billDto = new BillDto();
        billDto.setId(bill.getId());
        billDto.setName(bill.getName());
        billDto.setPrice(bill.getPrice());
        billDto.setQuantity(bill.getQuantity());
        billDto.setGroupId(bill.getGroup().getId());
        return billDto;
    }

    private Bill convertToEntity(BillDto billDto, Group group) {
        Bill bill = new Bill();
        bill.setId(billDto.getId());
        bill.setName(billDto.getName());
        bill.setPrice(billDto.getPrice());
        bill.setQuantity(billDto.getQuantity());
        bill.setGroup(group);
        return bill;
    }
}