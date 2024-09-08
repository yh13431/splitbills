package com.splitbills.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AwsService {

    @Autowired
    private AmazonS3 amazonS3;

    public void uploadFile(String bucketName, String fileKey, long fileSize, String contentType, InputStream inputStream) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(fileSize);
        metadata.setContentType(contentType);
        amazonS3.putObject(new PutObjectRequest(bucketName, fileKey, inputStream, metadata));
    }

    public List<String> listFiles(String bucketName) {
        ListObjectsV2Request listObjects = new ListObjectsV2Request().withBucketName(bucketName);
        ListObjectsV2Result result = amazonS3.listObjectsV2(listObjects);
        List<S3ObjectSummary> objects = result.getObjectSummaries();

        return objects.stream()
                .map(obj -> amazonS3.getUrl(bucketName, obj.getKey()).toString())
                .collect(Collectors.toList());
    }

    public List<String> listFilesByPrefix(String bucketName, String prefix) {
        ListObjectsV2Request listObjects = new ListObjectsV2Request().withBucketName(bucketName).withPrefix(prefix);
        ListObjectsV2Result result = amazonS3.listObjectsV2(listObjects);
        List<S3ObjectSummary> objects = result.getObjectSummaries();

        return objects.stream()
                .map(obj -> amazonS3.getUrl(bucketName, obj.getKey()).toString())
                .collect(Collectors.toList());
    }

    public byte[] downloadFile(String bucketName, String fileName) throws IOException {
        S3Object s3Object = amazonS3.getObject(bucketName, fileName);
        InputStream inputStream = s3Object.getObjectContent();
        
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length;
        
        while ((length = inputStream.read(buffer)) != -1) {
            byteArrayOutputStream.write(buffer, 0, length);
        }
    
        return byteArrayOutputStream.toByteArray();
    }
    
    
    public void deleteFile(String bucketName, String fileKey) {
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, fileKey));
    }
}
