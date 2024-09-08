package com.splitbills.backend.service;

import com.amazonaws.AmazonClientException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface AwsService {
    
    void uploadFile(
        final String bucketName,
        final String groupName,
        final String fileName,
        final long contentLength,
        final String contentType,
        final InputStream value
    ) throws AmazonClientException;

    ByteArrayOutputStream downloadFile(
        final String bucketName,
        final String groupName,
        final String fileName
    ) throws IOException, AmazonClientException;

    List<String> listFiles(
        final String bucketName,
        final String groupName
    ) throws AmazonClientException;

    void deleteFile(
        final String bucketName,
        final String groupName,
        final String fileName
    ) throws AmazonClientException;
}
