package com.example.backend_comic_service.develop.model.model;


import com.example.backend_comic_service.develop.entity.CategoryEntity;
import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class CategoryModel {
    private Integer id;
    private String code;
    private String name;
    private String description;
    private Integer status;
    private Integer isDeleted;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdDate;
    private Integer createdBy;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime updatedDate;
    private Integer updatedBy;
    private Integer catalogId;
    private String catalogName;
    public CategoryEntity categoryEntity(){
        CategoryEntity model = new CategoryEntity();
        model.setId(id);
        model.setCode(code);
        model.setName(name);
        model.setDescription(description);
        model.setStatus(status);
        model.setIsDeleted(0);
        return model;
    }

}
