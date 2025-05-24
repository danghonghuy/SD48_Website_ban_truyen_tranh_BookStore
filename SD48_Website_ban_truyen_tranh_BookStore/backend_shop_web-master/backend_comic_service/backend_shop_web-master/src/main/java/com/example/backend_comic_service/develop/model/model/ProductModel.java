package com.example.backend_comic_service.develop.model.model;

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
@Data // Bao gồm @ToString, @EqualsAndHashCode, @Getter, @Setter, @RequiredArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductModel {
    private Integer id;
    private String code;
    private String name;
    private String description;

    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY, timezone = Common.ASIA_HO_CHI_MINH)
    private LocalDate datePublish;

    private float price; // Giữ nguyên kiểu float nếu ProductEntity của bạn là float
    private float priceDiscount; // Giữ nguyên kiểu float nếu ProductEntity của bạn là float

    private Integer stock;
    private Integer format; // Giả sử đây là kiểu Integer (ví dụ: khổ sách, loại bìa...)

    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = Common.ASIA_HO_CHI_MINH)
    private LocalDateTime createdDate;
    private Integer createdBy;

    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = Common.ASIA_HO_CHI_MINH)
    private LocalDateTime updatedDate;
    private Integer updatedBy;

    private Integer isDeleted;
    private Integer categoryId;
    private Integer typeId;
    private String categoryName;
    private String typeName;
    private Integer soldQuantity;
    private List<ImageDTO> images;
    private String catalog;
    private String series;

    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY, timezone = Common.ASIA_HO_CHI_MINH)
    private LocalDate datePublic;
    private Integer status;

    private DiscountDTO discountDTO; // Thông tin về khuyến mãi được áp dụng (nếu có)

    private List<AuthorModel> authors;
    private PublisherModel publisherInfo;
    private DistributorModel distributorInfo;

    // Các trường mới để hiển thị giá
    private Double originalPrice; // Giá gốc trước mọi khuyến mãi sản phẩm
    private Double finalPrice;    // Giá cuối cùng sau khi áp dụng khuyến mãi sản phẩm
}