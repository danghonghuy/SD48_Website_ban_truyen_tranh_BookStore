package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.CouponModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "coupon")
public class CouponEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
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
    @Column(name = "quantity_used")
    private Integer quantityUsed;
    @Column(name = "status")
    private Integer status;
    @Column(name = "is_delete")
    private Integer isDelete;
    @Column(name = "max_value")
    private Integer maxValue;
    @Column(name = "date_start")
    private Date dateStart;
    @Column(name = "date_end")
    private Date dateEnd;
    @Column(name = "created_date")
    private  Date createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name =  "updated_date")
    private  Date updatedDate;
    @Column(name = "updated_by")
    private  Integer updated_by;
    public CouponModel toCouponModel(){
        CouponModel couponModel = new CouponModel();
        couponModel.setId(id);
        couponModel.setCode(code);
        couponModel.setName(name);
        couponModel.setDescription(description);
        couponModel.setType(type);
        couponModel.setMinValue(minValue);
        couponModel.setQuantity(quantity);
        couponModel.setQuantityUsed(quantityUsed);
        couponModel.setStatus(status);
        couponModel.setIsDelete(isDelete);
        couponModel.setMaxValue(maxValue);
        couponModel.setDateStart(dateStart);
        couponModel.setDateEnd(dateEnd);
        couponModel.setCreatedDate(createdDate);
        couponModel.setCreatedBy(createdBy);
        couponModel.setUpdatedDate(updatedDate);
        return couponModel;
    }

}
