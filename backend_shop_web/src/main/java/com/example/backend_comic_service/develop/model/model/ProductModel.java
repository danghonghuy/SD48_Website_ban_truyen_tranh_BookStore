package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.CategoryEntity;
import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.entity.TypeEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
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
    private List<String> images;
    private String catalog;
    private String authorPublish;
    private String series;
    private String author;
    private String publisher;
    private Date datePublic;
    private Integer status;
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
        productEntity.setCatalog(catalog);
        productEntity.setAuthorPublish(authorPublish);
        productEntity.setSeries(series);
        productEntity.setAuthor(author);
        productEntity.setPublisher(publisher);
        productEntity.setDatePublic(datePublic);
        productEntity.setStatus(status);
        return productEntity;
    }
}
