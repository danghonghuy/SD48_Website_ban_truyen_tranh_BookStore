package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.DeliveryEntity;
import com.example.backend_comic_service.develop.entity.PaymentEntity;
import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DeliveryModel {
    private Integer id;
    private String code;
    private String name;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdDate;
    private int createdBy;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime updatedDate;
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
