package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.PaymentEntity;
import lombok.*;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class PaymentModel {
    private  Integer id;
    private String code;
    private String name;
    private Date createdDate;
    private Date updatedDate;
    private Integer updatedBy;
    private Integer createdBy;
    public PaymentEntity toEntity() {
        PaymentEntity paymentEntity = new PaymentEntity();
        paymentEntity.setId(id);
        paymentEntity.setCode(code);
        paymentEntity.setName(name);
        paymentEntity.setCreatedDate(createdDate);
        paymentEntity.setUpdatedDate(updatedDate);
        paymentEntity.setUpdatedBy(updatedBy);
        paymentEntity.setCreatedBy(createdBy);
        return paymentEntity;
    }
}
