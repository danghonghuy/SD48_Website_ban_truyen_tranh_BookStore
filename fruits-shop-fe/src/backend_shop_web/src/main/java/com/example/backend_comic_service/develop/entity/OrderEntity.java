package com.example.backend_comic_service.develop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "orders")
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "code")
    private String code;
    @Column(name = "order_date")
    private Date orderDate;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
    @ManyToOne
    @JoinColumn(name = "payment_id")
    private PaymentEntity payment;
    @Column(name = "total_price")
    private Double totalPrice;
    @Column(name = "status")
    private Integer status;
    @Column(name = "stage")
    private Integer stage;
    @Column(name = "fee_delivery")
    private Integer feeDelivery;
    @Column(name = "description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private UserEntity employee;
    @Column(name = "type")
    private Integer type;
    @Column(name = "real_price")
    private Integer realPrice;
    @Column(name = "created_date")
    private Date createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_date")
    private Date updatedDate;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @ManyToOne
    @JoinColumn(name = "address_id")
    private AddressEntity address;
    @ManyToOne
    @JoinColumn(name = "delivery_type")
    private DeliveryEntity deliveryType;
    @Column(name = "coupon_id")
    private Integer couponId;
}
