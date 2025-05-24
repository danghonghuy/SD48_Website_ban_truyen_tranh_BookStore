package com.example.backend_comic_service.develop.model.dto;

import lombok.Data;

@Data
public class DiscountDTO {
    private String code;
    private String name;
    private String description;
    private Integer moneyDiscount;
    private Integer percent;
}
