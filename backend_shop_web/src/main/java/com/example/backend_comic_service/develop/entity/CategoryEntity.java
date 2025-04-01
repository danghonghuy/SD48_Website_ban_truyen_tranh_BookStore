package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.CategoryModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "category")
public class CategoryEntity {
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
    @OneToMany(mappedBy = "categoryEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductEntity> products;
    @ManyToOne
    @JoinColumn(name = "catalog_id")
    private CatalogEntity catalogEntity;

    public CategoryModel categoryModel(){
        CategoryModel model = new CategoryModel();
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
        model.setCatalogId(this.getCatalogEntity() != null ? this.getCatalogEntity().getId() : null);
        model.setCatalogName(this.getCatalogEntity() != null ? this.getCatalogEntity().getName() : null);
        return model;
    }

}
