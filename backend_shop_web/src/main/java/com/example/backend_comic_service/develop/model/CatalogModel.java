package com.example.backend_comic_service.develop.model;

import com.example.backend_comic_service.develop.entity.CatalogEntity;
import lombok.*;
import java.sql.Date;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class CatalogModel {
    private Integer id;
    private String code;
    private String name;
    private String description;
    private Integer status;
    private Integer isDeleted;
    private LocalDateTime createdDate;
    private Integer createdBy;
    private LocalDateTime updatedDate;
    private Integer updatedBy;
    public CatalogEntity toEntity() {
        CatalogEntity catalogEntity = new CatalogEntity();
        catalogEntity.setId(id);
        catalogEntity.setCode(code);
        catalogEntity.setName(name);
        catalogEntity.setDescription(description);
        catalogEntity.setStatus(status);
        catalogEntity.setCreatedDate(createdDate);
        catalogEntity.setCreatedBy(createdBy);
        catalogEntity.setUpdatedDate(updatedDate);
        catalogEntity.setUpdatedBy(updatedBy);
        return catalogEntity;
    }
}

