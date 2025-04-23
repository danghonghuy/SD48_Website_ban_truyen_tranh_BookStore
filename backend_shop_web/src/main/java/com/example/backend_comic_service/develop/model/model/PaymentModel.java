package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.PaymentEntity;
import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class PaymentModel {
    private  Integer id;
    private String code;
    private String name;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdDate;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime updatedDate;
    private Integer updatedBy;
    private Integer createdBy;
    private Integer status;
    public PaymentEntity toEntity() {
        PaymentEntity paymentEntity = new PaymentEntity();
        paymentEntity.setId(id);
        paymentEntity.setCode(code);
        paymentEntity.setName(name);
        paymentEntity.setCreatedDate(createdDate);
        paymentEntity.setUpdatedDate(updatedDate);
        paymentEntity.setUpdatedBy(updatedBy);
        paymentEntity.setCreatedBy(createdBy);
        paymentEntity.setStatus(status);
        return paymentEntity;
    }
}
