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
