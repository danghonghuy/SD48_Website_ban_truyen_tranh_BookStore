package com.example.backend_comic_service.develop.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;

@Component
public class HandleImageService {

    @Value("${com.develop.path-save-image}")
    private String saveImagePath;
    @Value("${com.develop.path-server-image}")
    private String serverImagePath;

    public String handleBase64Image(String filePath){
        try{
            Path path = Paths.get(filePath);
            byte[] image = Files.readAllBytes(path);
            if (!Files.exists(path)) {
                throw new IOException("Image not found at path: " + path);
            }
            return Base64.getEncoder().encodeToString(image);
        } catch(Exception e){
            return "";
        }
    }

    public String saveFileImage(MultipartFile file){
        try{
            LocalDateTime localDateTime = LocalDateTime.now();
            String originalFilename = file.getOriginalFilename();
            Path path = Paths.get(saveImagePath + localDateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()+ originalFilename);
            Files.copy(file.getInputStream(), path);
            return serverImagePath +  localDateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()+ originalFilename;
        }
        catch (Exception e){
            return "";
        }
    }

    public String saveBase64Image(String imageBase64){
        try{
            LocalDateTime localDateTime = LocalDateTime.now();
            String outputFilePath = saveImagePath + localDateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli() + "portrait.png";
            String base64String = imageBase64.split("base64,")[1];
            byte[] imageBytes = Base64.getDecoder().decode(base64String);
            try (FileOutputStream fileOutputStream = new FileOutputStream(outputFilePath)) {
                fileOutputStream.write(imageBytes);
                System.out.println("File saved successfully to " + outputFilePath);
            }
            return outputFilePath;
        }
        catch (Exception e){
            return "";
        }
    }
}
