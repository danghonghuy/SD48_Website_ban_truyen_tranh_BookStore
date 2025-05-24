package com.example.backend_comic_service.develop.model.dto;

import lombok.Data;

@Data
public class ImageDTO {
    private String imageUrl;
    private Integer id;
    private Integer isDeleted;
}
