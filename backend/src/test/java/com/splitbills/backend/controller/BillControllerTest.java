package com.splitbills.backend.controller;

import com.splitbills.backend.dto.BillDto;
import com.splitbills.backend.model.Bill;
import com.splitbills.backend.model.Group;
import com.splitbills.backend.model.User;
import com.splitbills.backend.service.BillService;
import com.splitbills.backend.service.GroupService;
import com.splitbills.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class BillControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BillService billService;

    @Mock
    private GroupService groupService;

    @Mock
    private UserService userService;

    @InjectMocks
    private BillController billController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(billController).build();
    }

    @Test
    void testGetAllBills() throws Exception {
        Long groupId = 1L;
        Group group = new Group();
        group.setId(groupId);
        Bill bill = new Bill();
        bill.setId(1L);
        bill.setName("Bill 1");
        bill.setPrice(100.0);

        when(groupService.getGroupById(groupId)).thenReturn(Optional.of(group));
        when(billService.getBillsByGroup(group)).thenReturn(Collections.singletonList(bill));

        mockMvc.perform(get("/api/groups/{groupId}/bills", groupId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Bill 1"));

        verify(groupService, times(1)).getGroupById(groupId);
        verify(billService, times(1)).getBillsByGroup(group);
    }

    @Test
    void testCreateBill() throws Exception {
        Long groupId = 1L;
        BillDto billDto = new BillDto();
        billDto.setName("New Bill");
        billDto.setPrice(200.0);
        Group group = new Group();
        group.setId(groupId);
        User user = new User();
        user.setId(1L);

        when(groupService.getGroupById(groupId)).thenReturn(Optional.of(group));
        when(userService.findUser(anyLong())).thenReturn(user);
        when(billService.createBill(any(Bill.class))).thenReturn(new Bill());

        mockMvc.perform(post("/api/groups/{groupId}/bills", groupId)
                .contentType("application/json")
                .content("{\"name\":\"New Bill\", \"price\":200.0, \"userId\":1}"))
                .andExpect(status().isOk());

        verify(billService, times(1)).createBill(any(Bill.class));
    }

    @Test
    void testDeleteBill() throws Exception {
        Long billId = 1L;

        mockMvc.perform(delete("/api/groups/{groupId}/bills/{id}", 1L, billId))
                .andExpect(status().isOk());

        verify(billService, times(1)).deleteBill(billId);
    }
}
