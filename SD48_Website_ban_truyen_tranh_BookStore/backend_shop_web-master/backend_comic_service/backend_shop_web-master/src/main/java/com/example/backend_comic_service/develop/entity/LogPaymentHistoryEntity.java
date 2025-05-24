package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.LogPaymentHistoryModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDateTime;

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
    @JoinColumn(name = "order_id")
    private OrderEntity order;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
    @Column(name = "description")
    private String description;
    @Column(name = "status")
    private Integer status;
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    @Column(name = "amount")
    private Double amount;

    public LogPaymentHistoryModel toModel() {
        LogPaymentHistoryModel model = new LogPaymentHistoryModel();
        model.setId(this.id);
        model.setCreatedBy(this.user.getUsername());
        model.setCreatedBy(this.user.getFullName());
        model.setDescription(this.description);
        model.setStatus(this.status);
        model.setCreatedDate(this.createdDate);
        model.setAmount(this.amount);
        return model;
    }
}
