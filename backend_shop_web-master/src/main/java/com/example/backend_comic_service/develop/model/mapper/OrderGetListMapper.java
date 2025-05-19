package com.example.backend_comic_service.develop.model.mapper;


import lombok.*;

import java.sql.Date;
import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class OrderGetListMapper {

    private Integer orderId;
    private String orderCode;
    private String orderDate;
    private Integer totalPrice;
    private Integer orderStatus;
    private Integer orderStage;
    private Integer feeDelivery;
    private Integer paymentId;
    private String paymentName;
    private Integer userId;
    private String customerName;
    public String phoneNumber;
    private Integer employeeId;
    private String employeeName;
    private Integer orderType;
    private String addressDetail;
    private String deliveryName;
    private Integer deliveryType;
    private Integer addressId;
}
