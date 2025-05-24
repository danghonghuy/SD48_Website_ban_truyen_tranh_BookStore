package com.example.backend_comic_service.develop.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.UUID;

@Component
@Slf4j
public class HandleImageService {

    @Value("${com.develop.path-save-image}")
    private String saveImagePath;

    public String handleBase64Image(String filePath) {
        try {
            Path path = Paths.get(filePath);
            if (!Files.exists(path)) {
                log.error("Image not found at path: {}", filePath);
                return "";
            }
            byte[] imageBytes = Files.readAllBytes(path);
            return Base64.getEncoder().encodeToString(imageBytes);
        } catch (IOException e) {
            log.error("IOException while reading image from path: {}", filePath, e);
            return "";
        } catch (Exception e) {
            log.error("Unexpected error while handling base64 image from path: {}", filePath, e);
            return "";
        }
    }

    public String saveFileImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            log.warn("MultipartFile is null or empty, cannot save.");
            return "";
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String uniqueFileName;
        try {
            String extension = "";
            int i = originalFilename.lastIndexOf('.');
            if (i > 0 && i < originalFilename.length() - 1) {
                extension = originalFilename.substring(i);
            }
            uniqueFileName = UUID.randomUUID().toString() + extension;

            Path directoryPath = Paths.get(saveImagePath);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
                log.info("Created directory: {}", saveImagePath);
            }

            Path filePathOnDisk = directoryPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePathOnDisk);
            log.info("Successfully saved file: {} to path: {}", originalFilename, filePathOnDisk);

            return "/uploads/" + uniqueFileName;

        } catch (IOException e) {
            log.error("IOException while saving multipart file: {}. Original filename: {}", e.getMessage(), originalFilename, e);
            return "";
        } catch (Exception e) {
            log.error("Unexpected error while saving multipart file. Original filename: {}", originalFilename, e);
            return "";
        }
    }

    public String saveBase64Image(String imageBase64) {
        if (!StringUtils.hasText(imageBase64)) {
            log.warn("Image Base64 string is null or empty.");
            return "";
        }

        try {
            String base64Data;
            if (imageBase64.contains("base64,")) {
                base64Data = imageBase64.split("base64,")[1];
            } else {
                base64Data = imageBase64;
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

            // Cố gắng xác định phần mở rộng từ dữ liệu base64 (đơn giản, có thể không chính xác hoàn toàn)
            // Hoặc mặc định là png nếu không xác định được
            String extension = "png"; // Mặc định
            // Bạn có thể thêm logic phức tạp hơn để suy ra extension từ vài byte đầu của imageBytes nếu cần

            String uniqueFileName = UUID.randomUUID().toString() + "." + extension;

            Path directoryPath = Paths.get(saveImagePath);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
                log.info("Created directory for Base64 image: {}", saveImagePath);
            }

            Path outputFilePathOnDisk = directoryPath.resolve(uniqueFileName);

            try (FileOutputStream fileOutputStream = new FileOutputStream(outputFilePathOnDisk.toFile())) {
                fileOutputStream.write(imageBytes);
            }
            log.info("Base64 image saved successfully to: {}", outputFilePathOnDisk);

            return "/uploads/" + uniqueFileName;

        } catch (IOException e) {
            log.error("IOException while saving Base64 image: {}", e.getMessage(), e);
            return "";
        } catch (IllegalArgumentException e) {
            log.error("IllegalArgumentException: Invalid Base64 string provided. {}", e.getMessage(), e);
            return "";
        } catch (Exception e) {
            log.error("Unexpected error while saving Base64 image: {}", e.getMessage(), e);
            return "";
        }
    }
}