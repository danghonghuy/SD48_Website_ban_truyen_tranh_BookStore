package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.CouponModel;
import com.example.backend_comic_service.develop.utils.LocalDateTimeSerializer;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.ZoneOffset;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "coupon")
public class CouponEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;
    @Column(name = "type")
    private Integer type;
    @Column(name = "min_value")
    private Integer minValue;
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "coupon_amount")
    private Integer couponAmount;
    @Column(name = "status")
    private Integer status;
    @Column(name = "is_delete")
    private Integer isDelete;
    @Column(name = "max_value")
    private Integer maxValue;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "date_start")
    private LocalDateTime dateStart;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "date_end")
    private LocalDateTime dateEnd;
    @Column(name = "created_date")
    private  Date createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name =  "updated_date")
    private  Date updatedDate;
    @Column(name = "updated_by")
    private  Integer updated_by;
    @Column(name = "quantity_used")
    private Integer quantityUsed;
    public CouponModel toCouponModel(){
        CouponModel couponModel = new CouponModel();
        couponModel.setId(id);
        couponModel.setCode(code);
        couponModel.setName(name);
        couponModel.setDescription(description);
        couponModel.setType(type);
        couponModel.setMinValue(minValue);
        couponModel.setQuantity(quantity);
        couponModel.setCouponAmount(couponAmount);
        couponModel.setStatus(status);
        couponModel.setIsDelete(isDelete);
        couponModel.setMaxValue(maxValue);
        couponModel.setDateStart(dateStart);
        couponModel.setDateEnd(dateEnd);
        couponModel.setCreatedDate(createdDate);
        couponModel.setCreatedBy(createdBy);
        couponModel.setUpdatedDate(updatedDate);
        couponModel.setQuantityUsed(quantityUsed);
        couponModel.setDateStartEpochTime(dateStart.toInstant(ZoneOffset.UTC).toEpochMilli());
        couponModel.setDateEndEpochTime(dateEnd.toInstant(ZoneOffset.UTC).toEpochMilli());
        return couponModel;
    }

}
