package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.RatingModel;
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
@Table(name = "rating")
public class RatingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductEntity productEntity;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;
    @Column(name = "rate")
    private Integer rate;
    @Column(name = "description")
    private String description;
    @Column(name = "created_date")
    private Date createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_date")
    private Date updatedDate;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @Column(name = "status")
    private Integer status;
    @Column(name = "is_delete")
    private Integer isDelete;
    public RatingModel toRatingModel() {
        RatingModel model = new RatingModel();
        model.setId(id);
        model.setProductId(productEntity.getId());
        model.setUserId(userEntity.getId());
        model.setRate(rate);
        model.setDescription(description);
        model.setCreatedDate(createdDate);
        model.setCreatedBy(createdBy);
        model.setUpdatedDate(updatedDate);
        model.setUpdatedBy(updatedBy);
        model.setStatus(status);
        model.setIsDelete(isDelete);
        return model;
    }
}
