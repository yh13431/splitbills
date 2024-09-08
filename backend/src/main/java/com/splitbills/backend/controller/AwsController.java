package com.splitbills.backend.controller;

import com.splitbills.backend.enumeration.FileType;
import com.splitbills.backend.service.AwsService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.SneakyThrows;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/s3bucketstorage")
public class AwsController {

    @Autowired
    private AwsService service;

    @GetMapping("/{bucketName}")
    public ResponseEntity<?> listFiles(
            @PathVariable("bucketName") String bucketName
    ) {
        val body = service.listFiles(bucketName);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/{bucketName}/groups/{groupId}/upload")
    @SneakyThrows(IOException.class)
    public ResponseEntity<?> uploadFileToGroup(
            @PathVariable("bucketName") String bucketName,
            @PathVariable("groupId") Long groupId,
            @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileKey = "group-" + groupId + "/" + fileName;

        String contentType = file.getContentType();
        long fileSize = file.getSize();
        InputStream inputStream = file.getInputStream();

        service.uploadFile(bucketName, fileKey, fileSize, contentType, inputStream);

        return ResponseEntity.ok().body("File uploaded successfully");
    }

    @GetMapping("/{bucketName}/groups/{groupId}/files")
    public ResponseEntity<?> listFilesByGroup(
            @PathVariable("bucketName") String bucketName,
            @PathVariable("groupId") Long groupId
    ) {
        String prefix = "group-" + groupId + "/";
        val body = service.listFilesByPrefix(bucketName, prefix);
        return ResponseEntity.ok(body);
    }

    @SneakyThrows
    @GetMapping("/{bucketName}/download/**")
    public ResponseEntity<byte[]> downloadFile(
            @PathVariable("bucketName") String bucketName,
            HttpServletRequest request
    ) {
        String filePath = request.getRequestURI().split("/s3bucketstorage/" + bucketName + "/download/")[1];

        byte[] fileContent = service.downloadFile(bucketName, filePath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.substring(filePath.lastIndexOf("/") + 1) + "\"")
                .contentType(FileType.fromFilename(filePath))
                .body(fileContent);
    }

    @DeleteMapping("/{bucketName}/{fileName}")
    public ResponseEntity<?> deleteFile(
            @PathVariable("bucketName") String bucketName,
            @PathVariable("fileName") String fileName
    ) {
        service.deleteFile(bucketName, fileName);
        return ResponseEntity.ok().build();
    }
}
