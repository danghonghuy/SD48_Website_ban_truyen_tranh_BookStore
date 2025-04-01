package com.example.backend_comic_service.develop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "order_coupon_mapping")
public class OrderCouponMappingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @ManyToOne
    @JoinColumn(name= "coupon_id")
    private CouponEntity couponEntity;
    @ManyToOne
    @JoinColumn(name = "order_id")
    private OrderEntity orderEntity;
}
