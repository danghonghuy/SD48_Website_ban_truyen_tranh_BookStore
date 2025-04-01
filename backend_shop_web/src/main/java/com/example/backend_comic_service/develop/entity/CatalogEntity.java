package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.CatalogModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "catalog")
public class CatalogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;
    @Column(name = "status")
    private Integer status;
    @Column(name = "is_deleted")
    private Integer isDeleted;
    @Column(name = "created_date")
    private Date createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_date")
    private Date updatedDate;
    @Column(name = "updated_by")
    private Integer updatedBy;
    public CatalogModel toModel() {
        CatalogModel catalogModel = new CatalogModel();
        catalogModel.setId(id);
        catalogModel.setCode(code);
        catalogModel.setName(name);
        catalogModel.setDescription(description);
        catalogModel.setStatus(status);
        catalogModel.setIsDeleted(isDeleted);
        catalogModel.setCreatedDate(createdDate);
        catalogModel.setCreatedBy(createdBy);
        catalogModel.setUpdatedDate(updatedDate);
        catalogModel.setUpdatedBy(updatedBy);
        return catalogModel;
    }
}
