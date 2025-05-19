package com.example.backend_comic_service.develop.model.mapper;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class ProductDiscountMapper {
    private Integer productId;
    private Integer discountId;
    private Integer discountType;
    private Integer discountPercent;
    private Integer discountMoney;
}
