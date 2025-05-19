package com.example.backend_comic_service.develop.model.request.product;

import com.example.backend_comic_service.develop.configs.configs_sercurity_service.LocalDateDeserializer;
import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.model.dto.ImageDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductRequest {
    private  Integer id;
    private String code;
    private String name;
    private String description;
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate datePublish;
    private float price;
    private float priceDiscount;
    private Integer stock;
    private Integer format;
    private LocalDateTime createdDate;
    private Integer createdBy;
    private LocalDateTime updatedDate;
    private Integer updatedBy;
    private  Integer isDeleted;
    private Integer categoryId;
    private Integer typeId;
    private String categoryName;
    private String typeName;
    private Integer soldQuantity;
    private List<ImageDTO> files;
    private String catalog;
    private String authorPublish;
    private String series;
    private String author;
    private String publisher;
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate datePublic;
    private Integer status;
    public ProductEntity toEntity() {
        ProductEntity productEntity = new ProductEntity();
        productEntity.setId(id);
        productEntity.setCode(code);
        productEntity.setName(name.replaceAll("\\s+", " ").trim());
        productEntity.setDescription(description.replaceAll("\\s+", " ").trim());
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
