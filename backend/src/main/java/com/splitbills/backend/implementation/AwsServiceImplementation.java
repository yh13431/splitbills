package com.splitbills.backend.implementation;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.splitbills.backend.service.AwsService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class AwsServiceImplementation implements AwsService {

    @Autowired
    private AmazonS3 s3Client;

    @Override
    public void uploadFile(
        final String bucketName,
        final String groupName,
        final String fileName,
        final long contentLength,
        final String contentType,
        final InputStream value
    ) throws AmazonClientException {
        String keyName = groupName + "/" + fileName;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(contentLength);
        metadata.setContentType(contentType);

        s3Client.putObject(bucketName, keyName, value, metadata);
        log.info("File uploaded to bucket({}): {}", bucketName, keyName);
    }

    @Override
    public ByteArrayOutputStream downloadFile(
        final String bucketName,
        final String groupName,
        final String fileName
    ) throws IOException, AmazonClientException {
        String keyName = groupName + "/" + fileName;
        S3Object s3Object = s3Client.getObject(bucketName, keyName);
        InputStream inputStream = s3Object.getObjectContent();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        int len;
        byte[] buffer = new byte[4096];
        while ((len = inputStream.read(buffer, 0, buffer.length)) != -1) {
            outputStream.write(buffer, 0, len);
        }

        log.info("File downloaded from bucket({}): {}", bucketName, keyName);
        return outputStream;
    }

    @Override
    public List<String> listFiles(final String bucketName, final String groupName) throws AmazonClientException {
        List<String> keys = new ArrayList<>();
        String prefix = groupName + "/";
        ObjectListing objectListing = s3Client.listObjects(bucketName, prefix);

        while (true) {
            List<S3ObjectSummary> objectSummaries = objectListing.getObjectSummaries();
            if (objectSummaries.isEmpty()) {
                break;
            }

            objectSummaries.stream()
                    .filter(item -> !item.getKey().endsWith("/"))
                    .map(S3ObjectSummary::getKey)
                    .forEach(keys::add);

            objectListing = s3Client.listNextBatchOfObjects(objectListing);
        }

        log.info("Files found in bucket({}) under group({}): {}", bucketName, groupName, keys);
        return keys;
    }

    @Override
    public void deleteFile(
        final String bucketName,
        final String groupName,
        final String fileName
    ) throws AmazonClientException {
        String keyName = groupName + "/" + fileName;
        s3Client.deleteObject(bucketName, keyName);
        log.info("File deleted from bucket({}): {}", bucketName, keyName);
    }
}
