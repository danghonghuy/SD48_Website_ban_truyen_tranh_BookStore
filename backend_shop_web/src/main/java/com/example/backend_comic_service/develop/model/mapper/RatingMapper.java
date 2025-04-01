package com.example.backend_comic_service.develop.model.mapper;

import lombok.*;

import java.sql.Date;

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
    private Date createdDate;
    private Integer createdBy;
    private Date updatedDate;
    private Integer updatedBy;
    private Integer status;
    private Integer isDelete;
    private String productName;
    private String fullName;
    private String userName;
}
