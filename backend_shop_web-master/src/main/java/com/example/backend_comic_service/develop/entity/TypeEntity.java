package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.TypeModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "types")
public class TypeEntity {
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
    private LocalDateTime createdDate;
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @OneToMany(mappedBy = "typeEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductEntity> products;
    public TypeModel toModel() {
        TypeModel typeModel = new TypeModel();
        typeModel.setId(id);
        typeModel.setCode(code);
        typeModel.setName(name);
        typeModel.setDescription(description);
        typeModel.setStatus(status);
        typeModel.setIsDeleted(isDeleted);
        typeModel.setCreatedDate(createdDate);
        typeModel.setUpdatedDate(updatedDate);
        typeModel.setCreatedBy(createdBy);
        typeModel.setUpdatedBy(updatedBy);
        return typeModel;
    }
}
