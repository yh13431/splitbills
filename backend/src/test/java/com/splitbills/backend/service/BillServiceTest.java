package com.splitbills.backend.service;

import com.splitbills.backend.model.Bill;
import com.splitbills.backend.model.Group;
import com.splitbills.backend.model.User;
import com.splitbills.backend.repository.BillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BillServiceTest {

    @Mock
    private BillRepository billRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private BillService billService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetBillById() {
        Bill bill = new Bill();
        bill.setId(1L);

        when(billRepository.findById(1L)).thenReturn(Optional.of(bill));

        Optional<Bill> result = billService.getBillById(1L);

        assert result.isPresent();
        assert result.get().getId() == 1L;
    }

    @Test
    void testCreateBill() {
        Bill bill = new Bill();
        bill.setId(1L);
        Group group = new Group();

        when(billRepository.save(any(Bill.class))).thenReturn(bill);

        Bill createdBill = billService.createBill(bill);

        assert createdBill.getId() == 1L;
        verify(billRepository, times(1)).save(bill);
    }

    @Test
    void testUpdateBill() {
        Long billId = 1L;
        Bill bill = new Bill();
        bill.setId(billId);

        when(billRepository.existsById(billId)).thenReturn(true);
        when(billRepository.save(any(Bill.class))).thenReturn(bill);

        Bill updatedBill = billService.updateBill(billId, bill);

        assert updatedBill.getId() == billId;
        verify(billRepository, times(1)).save(bill);
    }

    @Test
    void testDeleteBill() {
        Long billId = 1L;

        when(billRepository.existsById(billId)).thenReturn(true);

        billService.deleteBill(billId);

        verify(billRepository, times(1)).deleteById(billId);
    }
}
