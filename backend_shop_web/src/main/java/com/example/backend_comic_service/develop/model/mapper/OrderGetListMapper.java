package com.example.backend_comic_service.develop.model.mapper;


import lombok.*;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class OrderGetListMapper {
    private Integer orderId;
    private String orderCode;
    private Date orderDate;
    private Double totalPrice;
    private Integer orderStatus;
    private Integer orderStage;
    private Double feeDelivery;
    private Integer paymentId;
    private String paymentName;
    private Integer userId;
    private String customerName;
    private Integer employeeId;
    private String employeeName;
    private Integer orderType;
    private String addressDetail;
    private String deliveryName;
    private Integer deliveryType;
    private Integer addressId;
    private String orderTypeName;
    private String phoneNumber;
}
