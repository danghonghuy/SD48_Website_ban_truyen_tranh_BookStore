package com.example.backend_comic_service.develop.model.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NamedEntityGraph
@Getter
@Setter
public class OrderModel {
    private Integer id;
    private String code;
    private Date orderDate;
    private Integer userId;
    private Integer paymentId;
    private Double totalPrice;
    private Integer status;
    private Integer stage;
    private Integer feeDelivery;
    private String description;
    private Integer employeeId;
    private Integer type;
    private Integer realPrice;
    private Date createdDate;
    private Integer createdBy;
    private Date updatedDate;
    private Integer updatedBy;
    private Integer addressId;
    private Integer deliveryType;
    private List<OrderDetailModel> orderDetailModels;
    private String couponCode;
}
