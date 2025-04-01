package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.entity.RatingEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class RatingModel {
    private Integer id;
    private Integer productId;
    private Integer userId;
    private Integer rate;
    private String description;
    private Date createdDate;
    private Integer createdBy;
    private Date updatedDate;
    private Integer updatedBy;
    private Integer status;
    private Integer isDelete;

    public RatingEntity toRatingEntity() {
        RatingEntity ratingEntity = new RatingEntity();
        ratingEntity.setId(id);
        ratingEntity.setRate(rate);
        ratingEntity.setDescription(description);
        ratingEntity.setCreatedDate(createdDate);
        ratingEntity.setCreatedBy(createdBy);
        ratingEntity.setUpdatedDate(updatedDate);
        ratingEntity.setUpdatedBy(updatedBy);
        ratingEntity.setStatus(status);
        ratingEntity.setIsDelete(isDelete);
        return ratingEntity;
    }
}
