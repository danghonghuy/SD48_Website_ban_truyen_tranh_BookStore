package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.DiscountEntity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class DiscountModel {
    private  Integer id;
    private String code;
    private String name;
    private String description;
    private Integer type;
    private Integer moneyDiscount;
    private Date startDate;
    private Date endDate;
    private Integer minValue;
    private Integer maxValue;
    private Integer status;
    private Integer isDeleted;
    private Date createdDate;
    private Integer createdBy;
    private Date updatedDate;
    private Integer updatedBy;
    private Integer percent;
    public DiscountEntity toEntity() {
        DiscountEntity discountEntity = new DiscountEntity();
        discountEntity.setId(id);
        discountEntity.setCode(code);
        discountEntity.setName(name);
        discountEntity.setDescription(description);
        discountEntity.setType(type);
        discountEntity.setMoneyDiscount(moneyDiscount);
        discountEntity.setStartDate(startDate);
        discountEntity.setEndDate(endDate);
        discountEntity.setMinValue(minValue);
        discountEntity.setMaxValue(maxValue);
        discountEntity.setStatus(status);
        discountEntity.setIsDeleted(isDeleted);
        discountEntity.setCreatedDate(createdDate);
        discountEntity.setCreatedBy(createdBy);
        discountEntity.setUpdatedDate(updatedDate);
        discountEntity.setUpdatedBy(updatedBy);
        discountEntity.setPercent(percent);
        return discountEntity;
    }
}
