package com.example.backend_comic_service.develop.model.model;


import com.example.backend_comic_service.develop.entity.CategoryEntity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.sql.Date;

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
    private Date createdDate;
    private Integer createdBy;
    private Date updatedDate;
    private Integer updatedBy;
    public CategoryEntity categoryEntity(){
        CategoryEntity model = new CategoryEntity();
        model.setId(this.getId());
        model.setCode(this.getCode());
        model.setName(this.getName());
        model.setDescription(this.getDescription());
        model.setStatus(this.getStatus());
        model.setIsDeleted(this.getIsDeleted());
        model.setCreatedBy(this.getCreatedBy());
        model.setCreatedDate(this.getCreatedDate());
        model.setUpdatedBy(this.getUpdatedBy());
        model.setUpdatedDate(this.getUpdatedDate());
        return model;
    }

}
