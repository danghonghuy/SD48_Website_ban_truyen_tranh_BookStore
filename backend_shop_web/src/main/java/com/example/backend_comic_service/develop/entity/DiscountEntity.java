package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.DiscountModel;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

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
    private LocalDateTime startDate;
    @Column(name = "end_date")
    private LocalDateTime endDate;
    @Column(name = "status")
    private Integer status;
    @Column(name = "is_deleted")
    private Integer isDeleted;
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @Column(name = "[percent]")
    private Integer percent;
    @OneToMany(mappedBy = "discount", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ProductDiscountEntity> productDiscountEntities;
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
        discountModel.setStatus(status);
        discountModel.setIsDeleted(isDeleted);
        discountModel.setCreatedDate(createdDate);
        discountModel.setCreatedBy(createdBy);
        discountModel.setUpdatedDate(updatedDate);
        discountModel.setUpdatedBy(updatedBy);
        discountModel.setPercent(percent);
        if(!productDiscountEntities.isEmpty()){
            List<Integer> productIds = productDiscountEntities.stream().map(ProductDiscountEntity::getProduct).toList().stream().map(ProductEntity::getId).toList();
            discountModel.setProductIds(productIds);
        }
        return discountModel;
    }
}
