package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.LogActionOrderModel;
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
@Table(name = "log_action_order")
public class LogActionOrderEntity {
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
    @Column(name = "status_id")
    private Integer statusId;
    @Column(name = "created_date")
    private Date createdDate;
    @Column(name = "name")
    private String name;
    public LogActionOrderModel toModel() {
        LogActionOrderModel logActionOrderModel = new LogActionOrderModel();
        logActionOrderModel.setId(id);
        logActionOrderModel.setCreatedDate(createdDate);
        logActionOrderModel.setDescription(description);
        logActionOrderModel.setName(name);
        logActionOrderModel.setStatusId(statusId);
        return logActionOrderModel;
    }
}
