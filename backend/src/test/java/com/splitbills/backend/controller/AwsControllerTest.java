package com.splitbills.backend.controller;

import com.splitbills.backend.service.AwsService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AwsControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AwsService awsService;

    @InjectMocks
    private AwsController awsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(awsController).build();
    }

    @Test
    void testListFiles() throws Exception {
        String bucketName = "test-bucket";
        List<String> files = Arrays.asList("file1.txt", "file2.txt");

        when(awsService.listFiles(bucketName)).thenReturn(files);

        mockMvc.perform(get("/s3bucketstorage/{bucketName}", bucketName))
                .andExpect(status().isOk())
                .andExpect(content().json("[\"file1.txt\", \"file2.txt\"]"));

        verify(awsService, times(1)).listFiles(bucketName);
    }

    @Test
    void testUploadFileToGroup() throws Exception {
        String bucketName = "test-bucket";
        Long groupId = 1L;
        String fileName = "file.txt";
        MultipartFile file = mock(MultipartFile.class);
        InputStream inputStream = new ByteArrayInputStream("test data".getBytes());

        when(file.getOriginalFilename()).thenReturn(fileName);
        when(file.getContentType()).thenReturn("text/plain");
        when(file.getSize()).thenReturn(9L);
        when(file.getInputStream()).thenReturn(inputStream);
        when(file.isEmpty()).thenReturn(false);

        mockMvc.perform(multipart("/s3bucketstorage/{bucketName}/groups/{groupId}/upload", bucketName, groupId)
                .file("file", "test data".getBytes()))
                .andExpect(status().isOk())
                .andExpect(content().string("File uploaded successfully"));

        verify(awsService, times(1)).uploadFile(eq(bucketName), anyString(), eq(9L), eq("text/plain"), any(InputStream.class));
    }

    @Test
    void testUploadFileToGroup_EmptyFile() throws Exception {
        String bucketName = "test-bucket";
        Long groupId = 1L;
        MultipartFile file = mock(MultipartFile.class);

        when(file.isEmpty()).thenReturn(true);

        mockMvc.perform(multipart("/s3bucketstorage/{bucketName}/groups/{groupId}/upload", bucketName, groupId)
                .file("file", new byte[0]))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("File is empty"));

        verify(awsService, never()).uploadFile(anyString(), anyString(), anyLong(), anyString(), any(InputStream.class));
    }

    @Test
    void testDownloadFile() throws Exception {
        String bucketName = "test-bucket";
        String filePath = "group-1/file.txt";
        byte[] fileContent = "test content".getBytes();
        HttpServletRequest request = mock(HttpServletRequest.class);

        when(request.getRequestURI()).thenReturn("/s3bucketstorage/test-bucket/download/" + filePath);
        when(awsService.downloadFile(bucketName, filePath)).thenReturn(fileContent);

        mockMvc.perform(get("/s3bucketstorage/{bucketName}/download/**", bucketName)
                .requestAttr("javax.servlet.request", request))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/octet-stream"))
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"file.txt\""));

        verify(awsService, times(1)).downloadFile(bucketName, filePath);
    }

    @Test
    void testDeleteFile() throws Exception {
        String bucketName = "test-bucket";
        String fileName = "file.txt";

        mockMvc.perform(delete("/s3bucketstorage/{bucketName}/{fileName}", bucketName, fileName))
                .andExpect(status().isOk());

        verify(awsService, times(1)).deleteFile(bucketName, fileName);
    }
}

