package com.example.backend_comic_service.develop.model.mapper;

import lombok.*;

import java.sql.Date;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class RatingMapper {
    private Integer id;
    private Integer productId;
    private Integer userId;
    private Integer rate;
    private String description;
    private LocalDateTime createdDate;
    private Integer createdBy;
    private LocalDateTime updatedDate;
    private Integer updatedBy;
    private Integer status;
    private Integer isDelete;
    private String productName;
    private String fullName;
    private String userName;
}
