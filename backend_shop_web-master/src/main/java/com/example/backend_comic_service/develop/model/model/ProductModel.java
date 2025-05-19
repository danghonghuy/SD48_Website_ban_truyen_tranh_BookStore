package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.model.dto.DiscountDTO;
import com.example.backend_comic_service.develop.model.dto.ImageDTO;
import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY, timezone = "Asia/Ho_Chi_Minh")
    private LocalDate datePublish;
    private float price;
    private float priceDiscount;
    private Integer stock;
    private Integer format;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdDate;
    private Integer createdBy;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime updatedDate;
    private Integer updatedBy;
    private  Integer isDeleted;
    private Integer categoryId;
    private Integer typeId;
    private String categoryName;
    private String typeName;
    private Integer soldQuantity;
    private List<ImageDTO> images;
    private String catalog;
    private String authorPublish;
    private String series;
    private String author;
    private String publisher;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY, timezone = "Asia/Ho_Chi_Minh")
    private LocalDate datePublic;
    private Integer status;
    DiscountDTO discountDTO;

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
