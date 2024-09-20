package com.splitbills.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AwsServiceTest {

    @Mock
    private AmazonS3 amazonS3;

    @InjectMocks
    private AwsService awsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUploadFile() {
        String bucketName = "test-bucket";
        String fileKey = "group-1/file.txt";
        long fileSize = 9L;
        String contentType = "text/plain";
        InputStream inputStream = new ByteArrayInputStream("test data".getBytes());

        awsService.uploadFile(bucketName, fileKey, fileSize, contentType, inputStream);

        verify(amazonS3, times(1)).putObject(any(PutObjectRequest.class));
    }

    @Test
    void testListFiles() {
        String bucketName = "test-bucket";
        S3ObjectSummary summary = new S3ObjectSummary();
        summary.setKey("file1.txt");
        ListObjectsV2Result result = mock(ListObjectsV2Result.class);
        when(result.getObjectSummaries()).thenReturn(Collections.singletonList(summary));
        when(amazonS3.listObjectsV2(any(ListObjectsV2Request.class))).thenReturn(result);

        List<String> files = awsService.listFiles(bucketName);

        verify(amazonS3, times(1)).listObjectsV2(any(ListObjectsV2Request.class));
        assert files.size() == 1;
        assert files.get(0).contains("file1.txt");
    }

    @Test
    void testDownloadFile() throws Exception {
        String bucketName = "test-bucket";
        String fileName = "file.txt";
    
        S3Object s3Object = mock(S3Object.class);
        S3ObjectInputStream s3InputStream = mock(S3ObjectInputStream.class);
        
        byte[] content = "file content".getBytes();
        InputStream inputStream = new ByteArrayInputStream(content);
        
        when(s3Object.getObjectContent()).thenReturn(s3InputStream);
        when(amazonS3.getObject(bucketName, fileName)).thenReturn(s3Object);
        when(s3InputStream.read(any(byte[].class))).thenAnswer(invocation -> {
            byte[] buffer = invocation.getArgument(0);
            System.arraycopy(content, 0, buffer, 0, content.length);
            return content.length;
        });
    
        byte[] result = awsService.downloadFile(bucketName, fileName);
    
        assert result.length == content.length; 
        verify(amazonS3, times(1)).getObject(bucketName, fileName);
        verify(s3InputStream, times(1)).close();
    }    

    @Test
    void testDeleteFile() {
        String bucketName = "test-bucket";
        String fileKey = "file.txt";

        awsService.deleteFile(bucketName, fileKey);

        verify(amazonS3, times(1)).deleteObject(any(DeleteObjectRequest.class));
    }
}
