package com.splitbills.backend.controller;

import lombok.SneakyThrows;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.splitbills.backend.service.AwsService;
import com.splitbills.backend.enumeration.FileType;

import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/s3bucketstorage")
public class AwsController {

    @Autowired
    private AwsService service;

    @GetMapping("/{bucketName}/{groupName}")
    public ResponseEntity<?> listFiles(
            @PathVariable("bucketName") String bucketName,
            @PathVariable("groupName") String groupName
    ) {
        val body = service.listFiles(bucketName, groupName);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/{bucketName}/{groupName}/upload")
    @SneakyThrows(IOException.class)
    public ResponseEntity<?> uploadFile(
            @PathVariable("bucketName") String bucketName,
            @PathVariable("groupName") String groupName,
            @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String contentType = file.getContentType();
        long fileSize = file.getSize();
        InputStream inputStream = file.getInputStream();

        service.uploadFile(bucketName, groupName, fileName, fileSize, contentType, inputStream);

        return ResponseEntity.ok().body("File uploaded successfully");
    }

    @SneakyThrows
    @GetMapping("/{bucketName}/{groupName}/download/{fileName}")
    public ResponseEntity<?> downloadFile(
            @PathVariable("bucketName") String bucketName,
            @PathVariable("groupName") String groupName,
            @PathVariable("fileName") String fileName
    ) {
        val body = service.downloadFile(bucketName, groupName, fileName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(FileType.fromFilename(fileName))
                .body(body.toByteArray());
    }

    @DeleteMapping("/{bucketName}/{groupName}/delete/{fileName}")
    public ResponseEntity<?> deleteFile(
            @PathVariable("bucketName") String bucketName,
            @PathVariable("groupName") String groupName,
            @PathVariable("fileName") String fileName
    ) {
        service.deleteFile(bucketName, groupName, fileName);
        return ResponseEntity.ok().build();
    }
}
