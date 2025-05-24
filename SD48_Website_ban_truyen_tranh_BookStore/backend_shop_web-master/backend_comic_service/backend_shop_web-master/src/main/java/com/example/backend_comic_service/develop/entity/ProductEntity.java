// Trong file: ProductEntity.java
package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.model.model.AuthorModel;
import com.example.backend_comic_service.develop.model.model.PublisherModel;
import com.example.backend_comic_service.develop.model.model.DistributorModel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "product")
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "code", unique = true)
    private String code;

    @Column(name = "name")
    private String name;

    // SỬA Ở ĐÂY: Bỏ @Lob, dùng length hoặc columnDefinition cho NVARCHAR(255)
    @Column(name = "description", length = 255) // Hoặc @Column(name = "description", columnDefinition = "NVARCHAR(255)")
    private String description;

    @Column(name = "date_publish")
    private LocalDate datePublish;

    @Column(name = "price")
    private float price;

    @Column(name = "price_discount")
    private float priceDiscount;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "format")
    private Integer format;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "updated_by")
    private Integer updatedBy;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private CategoryEntity categoryEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id")
    private TypeEntity typeEntity;

    @OneToMany(mappedBy = "productEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    List<ImageEntity> imageEntities;

    @Column(name = "catalog", length = 150)
    private String catalog;

    @Column(name = "series", length = 150)
    private String series;

    @Column(name = "date_public")
    private LocalDate datePublic;

    @Column(name = "status")
    private Integer status;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "ProductAuthors",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private Set<AuthorEntity> authors = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    private PublisherEntity publisher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "distributor_id")
    private DistributorEntity distributor;

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        if (isDeleted == null) {
            isDeleted = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

    public ProductModel toProductModel() {
        ProductModel productModel = new ProductModel();
        productModel.setId(this.id);
        productModel.setCode(this.code);
        productModel.setName(this.name);
        productModel.setDescription(this.description);
        productModel.setDatePublish(this.datePublish);
        productModel.setPrice(this.price);
        productModel.setPriceDiscount(this.priceDiscount);
        productModel.setStock(this.stock);
        productModel.setFormat(this.format);
        productModel.setCreatedDate(this.createdDate);
        productModel.setCreatedBy(this.createdBy);
        productModel.setUpdatedDate(this.updatedDate);
        productModel.setUpdatedBy(this.updatedBy);
        productModel.setIsDeleted(this.isDeleted);

        if (this.categoryEntity != null) {
            productModel.setCategoryId(this.categoryEntity.getId());
            productModel.setCategoryName(this.categoryEntity.getName());
        }
        if (this.typeEntity != null) {
            productModel.setTypeId(this.typeEntity.getId());
            productModel.setTypeName(this.typeEntity.getName());
        }

        if (this.imageEntities != null && !this.imageEntities.isEmpty()) {
            productModel.setImages(this.imageEntities.stream()
                    .filter(e -> e.getIsDeleted() == null || e.getIsDeleted() == 0)
                    .map(ImageEntity::toDto)
                    .collect(Collectors.toList()));
        } else {
            productModel.setImages(new ArrayList<>());
        }

        productModel.setCatalog(this.catalog);
        productModel.setSeries(this.series);
        productModel.setDatePublic(this.datePublic);
        productModel.setStatus(this.status);

        if (this.authors != null && !this.authors.isEmpty()) {
            productModel.setAuthors(this.authors.stream()
                    .map(AuthorEntity::toModel)
                    .collect(Collectors.toList()));
        } else {
            productModel.setAuthors(new ArrayList<>());
        }

        if (this.publisher != null) {
            productModel.setPublisherInfo(this.publisher.toModel());
        }

        if (this.distributor != null) {
            productModel.setDistributorInfo(this.distributor.toModel());
        }
        return productModel;
    }
}