package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.DeliveryModel;
import com.example.backend_comic_service.develop.model.model.PaymentModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "delivery")
public class DeliveryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "created_date")
    private Date createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_date")
    private Date updatedDate;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @Column(name = "fee")
    private Integer fee;
    @Column(name = "status")
    public Integer status;
    @Column(name = "desrciption")
    public String description;
    public DeliveryModel toModel() {
        DeliveryModel model = new DeliveryModel();
        model.setId(id);
        model.setCode(code);
        model.setName(name);
        model.setCreatedDate(createdDate);
        model.setUpdatedDate(updatedDate);
        model.setUpdatedBy(updatedBy);
        model.setFee(fee);
        model.setStatus(status);
        model.setDescription(description);
        return model;
    }
}
