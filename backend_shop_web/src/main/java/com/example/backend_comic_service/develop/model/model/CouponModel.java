package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.CouponEntity;
import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
import java.time.LocalDateTime;

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
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime dateStart;

    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime dateEnd;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private  LocalDateTime createdDate;
    private Integer createdBy;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private  LocalDateTime updatedDate;
    private  Integer updated_by;
    private Integer quantityUsed;
    private Long dateStartEpochTime;
    private Long dateEndEpochTime;
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
        couponEntity.setQuantityUsed(0);
        return couponEntity;
    }
}
