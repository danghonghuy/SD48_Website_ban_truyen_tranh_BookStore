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
@Table(name = "log_payment_history")
public class LogPaymentHistoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "payment_id")
    private PaymentEntity payment;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
    @Column(name = "description")
    private String description;
    @Column(name = "status")
    private Integer status;
    @Column(name = "created_date")
    private Date createdDate;
    @Column(name = "amount")
    private Double amount;
}
