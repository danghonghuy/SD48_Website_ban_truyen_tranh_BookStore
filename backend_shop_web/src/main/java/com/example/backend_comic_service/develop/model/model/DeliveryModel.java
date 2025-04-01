package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.DeliveryEntity;
import com.example.backend_comic_service.develop.entity.PaymentEntity;
import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DeliveryModel {
    private Integer id;
    private String code;
    private String name;
    private Date createdDate;
    private int createdBy;
    private Date updatedDate;
    private int updatedBy;
    private Integer fee;
    public Integer status;
    public String description;
    public DeliveryEntity toEntity() {
        DeliveryEntity deliveryEntity = new DeliveryEntity();
        deliveryEntity.setId(id);
        deliveryEntity.setCode(code);
        deliveryEntity.setName(name);
        deliveryEntity.setCreatedDate(createdDate);
        deliveryEntity.setUpdatedDate(updatedDate);
        deliveryEntity.setUpdatedBy(updatedBy);
        deliveryEntity.setCreatedBy(createdBy);
        deliveryEntity.setStatus(status);
        deliveryEntity.setDescription(description);
        deliveryEntity.setFee(fee);
        return deliveryEntity;
    }
}
