package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.TypeEntity;
import lombok.*;

import java.util.Date;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class TypeModel {

    private Integer id;
    private String code;
    private String name;
    private String description;
    private Integer status;
    private Integer isDeleted;
    private Date createdDate;
    private Date updatedDate;
    private Integer createdBy;
    private Integer updatedBy;

    public TypeEntity toEntity() {
        TypeEntity typeEntity = new TypeEntity();
        typeEntity.setId(id);
        typeEntity.setCode(code);
        typeEntity.setName(name);
        typeEntity.setDescription(description);
        typeEntity.setStatus(status);
        typeEntity.setCreatedDate(createdDate);
        typeEntity.setUpdatedDate(updatedDate);
        typeEntity.setCreatedBy(createdBy);
        typeEntity.setUpdatedBy(updatedBy);
        return typeEntity;
    }
}
