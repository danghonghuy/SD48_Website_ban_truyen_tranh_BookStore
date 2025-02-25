package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.CategoryEntity;
import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.entity.TypeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class ProductModel {
    private  Integer id;
    private String code;
    private String name;
    private String description;
    private Date datePublish;
    private float price;
    private float priceDiscount;
    private Integer stock;
    private Integer format;
    private Date createdDate;
    private Integer createdBy;
    private Date updatedDate;
    private Integer updatedBy;
    private  Integer isDeleted;
    private Integer categoryId;
    private Integer typeId;
    private String categoryName;
    private String typeName;
    private Integer soldQuantity;
    public ProductEntity toEntity() {
        ProductEntity productEntity = new ProductEntity();
        productEntity.setId(id);
        productEntity.setCode(code);
        productEntity.setName(name);
        productEntity.setDescription(description);
        productEntity.setDatePublish(datePublish);
        productEntity.setPrice(price);
        productEntity.setPriceDiscount(priceDiscount);
        productEntity.setStock(stock);
        productEntity.setFormat(format);
        productEntity.setCreatedDate(createdDate);
        productEntity.setCreatedBy(createdBy);
        productEntity.setUpdatedDate(updatedDate);
        productEntity.setUpdatedBy(updatedBy);
        productEntity.setIsDeleted(isDeleted);
        return productEntity;
    }
}
