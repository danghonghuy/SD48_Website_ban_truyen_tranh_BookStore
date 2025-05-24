package com.example.backend_comic_service.develop.model.model; // Đảm bảo package đúng

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublisherModel {

    private Integer id;
    private String name;
    private String description;
    private String address;
    private String phoneNumber;
    private String email;
    private LocalDateTime createdDate; // Thêm nếu bạn muốn hiển thị hoặc xử lý ở frontend
    private LocalDateTime updatedDate; // Thêm nếu bạn muốn hiển thị hoặc xử lý ở frontend

}