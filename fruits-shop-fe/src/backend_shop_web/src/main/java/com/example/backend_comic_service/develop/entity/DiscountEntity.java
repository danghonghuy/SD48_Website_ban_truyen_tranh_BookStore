package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.DiscountModel;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "discount")
public class DiscountEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private  Integer id;
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;
    @Column(name = "type")
    private Integer type;
    @Column(name = "money_discount")
    private Integer moneyDiscount;
    @Column(name = "start_date")
    private Date startDate;
    @Column(name = "end_date")
    private Date endDate;
    @Column(name = "min_value")
    private Integer minValue;
    @Column(name = "max_value")
    private Integer maxValue;
    @Column(name = "status")
    private Integer status;
    @Column(name = "is_deleted")
    private Integer isDeleted;
    @Column(name = "created_date")
    private Date createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_date")
    private Date updatedDate;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @Column(name = "[percent]")
    private Integer percent;
    public DiscountModel toDiscountModel() {
        DiscountModel discountModel = new DiscountModel();
        discountModel.setId(id);
        discountModel.setCode(code);
        discountModel.setName(name);
        discountModel.setDescription(description);
        discountModel.setType(type);
        discountModel.setMoneyDiscount(moneyDiscount);
        discountModel.setStartDate(startDate);
        discountModel.setEndDate(endDate);
        discountModel.setMinValue(minValue);
        discountModel.setMaxValue(maxValue);
        discountModel.setStatus(status);
        discountModel.setIsDeleted(isDeleted);
        discountModel.setCreatedDate(createdDate);
        discountModel.setCreatedBy(createdBy);
        discountModel.setUpdatedDate(updatedDate);
        discountModel.setUpdatedBy(updatedBy);
        discountModel.setPercent(percent);
        return discountModel;
    }
}
