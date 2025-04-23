package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.model.model.OrderDetailModel;
import com.example.backend_comic_service.develop.model.model.OrderModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.aspectj.weaver.ast.Or;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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
    private LocalDate orderDate;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
    @ManyToOne
    @JoinColumn(name = "payment_id")
    private PaymentEntity payment;
    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "status")
//    @Enumerated(EnumType.ORDINAL)
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
    private LocalDateTime createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
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
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderDetailEntity> orderDetailEntities;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LogPaymentHistoryEntity> paymentHistoryEntities;

    @Column(name = "user_type")
    private Integer userType;
    public OrderModel toModel(){
        OrderModel orderModel = new OrderModel();
        orderModel.setId(id);
        orderModel.setCode(code);
        orderModel.setOrderDate(orderDate);
        orderModel.setFeeDelivery(feeDelivery);
        orderModel.setRealPrice(realPrice);
        orderModel.setTotalPrice(totalPrice);
        orderModel.setDeliveryModel(deliveryType.toModel());
        orderModel.setPaymentModel(payment.toModel());
        orderModel.setUserModel(user.toUserModel());
        orderModel.setOrderDetailModels(orderDetailEntities.stream().map(OrderDetailEntity::toModel).toList());
        orderModel.setAddressModel(address.toModel());
        orderModel.setCouponId(couponId);
        orderModel.setType(type);
        orderModel.setUserType(userType);
        orderModel.setStatus(OrderStatusEnum.fromValue(status));
        return orderModel;
    }

}
