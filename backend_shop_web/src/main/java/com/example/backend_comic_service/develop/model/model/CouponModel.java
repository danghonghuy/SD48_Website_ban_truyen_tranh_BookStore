package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.CouponEntity;
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
public class CouponModel {
    private Integer id;
    private String code;
    private String name;
    private String description;
    private Integer type;
    private Integer minValue;
    private Integer quantity;
    private Integer couponAmount;
    private Integer status;
    private Integer isDelete;
    private Integer maxValue;
    private Date dateStart;
    private Date dateEnd;
    private  Date createdDate;
    private Integer createdBy;
    private  Date updatedDate;
    private  Integer updated_by;
    public CouponEntity toEntity() {
        CouponEntity couponEntity = new CouponEntity();
        couponEntity.setId(id);
        couponEntity.setCode(code);
        couponEntity.setName(name);
        couponEntity.setDescription(description);
        couponEntity.setType(type);
        couponEntity.setMinValue(minValue);
        couponEntity.setQuantity(quantity);
        couponEntity.setCouponAmount(couponAmount);
        couponEntity.setStatus(status);
        couponEntity.setIsDelete(isDelete);
        couponEntity.setMaxValue(maxValue);
        couponEntity.setDateStart(dateStart);
        couponEntity.setDateEnd(dateEnd);
        couponEntity.setCreatedDate(createdDate);
        couponEntity.setCreatedBy(createdBy);
        couponEntity.setUpdatedDate(updatedDate);
        return couponEntity;
    }
}
