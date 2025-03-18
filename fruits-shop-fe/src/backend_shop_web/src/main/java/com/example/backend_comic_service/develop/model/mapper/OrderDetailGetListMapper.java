package com.example.backend_comic_service.develop.model.mapper;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDetailGetListMapper {
    private Integer id;
    private Integer quantity;
    private Integer total;
    private Integer price;
    private Integer productId;
    private Integer productName;
    private Double originPrice;
}
