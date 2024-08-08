package com.splitbills.backend.bill;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.splitbills.backend.controller.BillController;
import com.splitbills.backend.model.Bill;
import com.splitbills.backend.service.BillService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import java.util.Arrays;
import java.util.Optional;

@WebMvcTest(BillController.class)
class BillControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private BillService billService;

    @InjectMocks
    private BillController billController;

    @Autowired
    private ObjectMapper objectMapper;

    private Bill bill;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(billController).build();

        bill = new Bill();
        bill.setId(1L);
        bill.setName("Sample Bill");
        bill.setPrice(100L);
        bill.setQuantity(2L);
    }

    @Test
    void testGetAllBills() throws Exception {
        when(billService.getAllBills()).thenReturn(Arrays.asList(bill));

        mockMvc.perform(get("/api/bills")
                .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$[0].name").value("Sample Bill"));
    }

    @Test
    void testGetBillById() throws Exception {
        when(billService.getBillById(anyLong())).thenReturn(Optional.of(bill));

        mockMvc.perform(get("/api/bills/1")
                .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.name").value("Sample Bill"));
    }

    @Test
    void testCreateBill() throws Exception {
        when(billService.createBill(any(Bill.class))).thenReturn(bill);

        mockMvc.perform(post("/api/bills")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(bill)))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.name").value("Sample Bill"));
    }

    @Test
    void testUpdateBill() throws Exception {
        when(billService.updateBill(anyLong(), any(Bill.class))).thenReturn(bill);

        mockMvc.perform(put("/api/bills/1")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(bill)))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.name").value("Sample Bill"));
    }

    @Test
    void testDeleteBill() throws Exception {
        mockMvc.perform(delete("/api/bills/1")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }
}