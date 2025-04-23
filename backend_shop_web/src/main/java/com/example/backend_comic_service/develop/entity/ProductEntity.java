package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.ProductModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
    private  Integer id;
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "description")
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
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @Column(name = "is_deleted")
    private  Integer isDeleted;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity categoryEntity;
    @ManyToOne
    @JoinColumn(name = "type_id")
    private TypeEntity typeEntity;
    @OneToMany(mappedBy = "productEntity")
    List<ImageEntity> imageEntities;
    @Column(name = "catalog")
    private String catalog;
    @Column(name= "author_publish")
    private String authorPublish;
    @Column(name = "series")
    private String series;
    @Column(name = "author")
    private String author;
    @Column(name = "publisher")
    private String publisher;
    @Column(name = "date_public")
    private LocalDate datePublic;
    @Column(name = "status")
    private Integer status;

    public ProductModel toProductModel() {
        ProductModel productModel = new ProductModel();
        productModel.setId(id);
        productModel.setCode(code);
        productModel.setName(name);
        productModel.setDescription(description);
        productModel.setDatePublish(datePublish);
        productModel.setPrice(price);
        productModel.setPriceDiscount(priceDiscount);
        productModel.setStock(stock);
        productModel.setFormat(format);
        productModel.setCreatedDate(createdDate);
        productModel.setCreatedBy(createdBy);
        productModel.setUpdatedDate(updatedDate);
        productModel.setUpdatedBy(updatedBy);
        productModel.setIsDeleted(isDeleted);
        productModel.setCategoryId(categoryEntity.getId());
        productModel.setTypeId(typeEntity.getId());
        productModel.setCategoryName(categoryEntity.getName());
        productModel.setTypeName(typeEntity.getName());
        productModel.setImages(imageEntities == null ? null : imageEntities.stream().map(ImageEntity::getImageUrl).toList());
        productModel.setCatalog(catalog);
        productModel.setAuthor(author);
        productModel.setPublisher(publisher);
        productModel.setSeries(series);
        productModel.setAuthorPublish(authorPublish);
        productModel.setDatePublic(datePublic);
        productModel.setStatus(status);
        return productModel;
    }
}
