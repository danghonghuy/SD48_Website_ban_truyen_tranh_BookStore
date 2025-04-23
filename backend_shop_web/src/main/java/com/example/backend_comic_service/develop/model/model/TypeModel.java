package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.TypeEntity;
import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
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
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdDate;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime updatedDate;
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
        typeEntity.setIsDeleted(isDeleted);
        return typeEntity;
    }
}
