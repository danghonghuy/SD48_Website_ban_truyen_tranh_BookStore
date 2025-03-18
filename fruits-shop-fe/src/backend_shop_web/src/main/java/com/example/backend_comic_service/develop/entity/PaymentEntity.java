package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.PaymentModel;
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
@Table(name = "payments")
public class PaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private  Integer id;
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name =  "created_date")
    private Date createdDate;
    @Column(name =  "updated_date")
    private Date updatedDate;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @Column(name =  "created_by")
    private Integer createdBy;
    @Column(name = "status")
    private  Integer status;
    @Column(name = "is_deleted")
    private Integer isDeleted;
    public PaymentModel toModel() {
        PaymentModel paymentModel = new PaymentModel();
        paymentModel.setId(id);
        paymentModel.setCode(code);
        paymentModel.setName(name);
        paymentModel.setCreatedDate(createdDate);
        paymentModel.setUpdatedDate(updatedDate);
        paymentModel.setUpdatedBy(updatedBy);
        return paymentModel;
    }
}
