package com.splitbills.backend.bill;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BillServiceTest {

    @Mock
    private BillRepository billRepository;

    @InjectMocks
    private BillService billService;

    private Bill bill;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        bill = new Bill();
        bill.setId(1L);
        bill.setName("Sample Bill");
        bill.setPrice(100L);
        bill.setQuantity(2L);
    }

    @Test
    void testGetAllBills() {
        when(billRepository.findAll()).thenReturn(Arrays.asList(bill));
        List<Bill> bills = billService.getAllBills();
        assertEquals(1, bills.size());
    }

    @Test
    void testGetBillById() {
        when(billRepository.findById(anyLong())).thenReturn(Optional.of(bill));
        Optional<Bill> result = billService.getBillById(1L);
        assertTrue(result.isPresent());
        assertEquals("Sample Bill", result.get().getName());
    }

    @Test
    void testCreateBill() {
        when(billRepository.save(any(Bill.class))).thenReturn(bill);
        Bill createdBill = billService.createBill(bill);
        assertEquals("Sample Bill", createdBill.getName());
    }

    @Test
    void testUpdateBill() {
        when(billRepository.existsById(anyLong())).thenReturn(true);
        when(billRepository.save(any(Bill.class))).thenReturn(bill);
        Bill updatedBill = billService.updateBill(1L, bill);
        assertEquals("Sample Bill", updatedBill.getName());
    }

    @Test
    void testDeleteBillNotFound() {
        when(billRepository.existsById(anyLong())).thenReturn(false);
        billService.deleteBill(1L);
        verify(billRepository, never()).deleteById(anyLong());
    }
}