package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.entity.RatingEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
import java.time.LocalDateTime;

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
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdDate;
    private Integer createdBy;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime updatedDate;
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
