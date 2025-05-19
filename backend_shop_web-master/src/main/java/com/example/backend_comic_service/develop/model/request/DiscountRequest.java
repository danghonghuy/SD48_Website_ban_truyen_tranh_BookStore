package com.example.backend_comic_service.develop.model.request;

import com.example.backend_comic_service.develop.configs.configs_sercurity_service.LocalDateTimeDeserializer;
import com.example.backend_comic_service.develop.entity.DiscountEntity;
import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class DiscountRequest {
    private  Integer id;
    private String code;
    private String name;
    private String description;
    private Integer type;
    private Integer moneyDiscount;
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime startDate;
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime endDate;
    private Integer status;
    private Integer isDeleted;
    private LocalDateTime createdDate;
    private Integer createdBy;
    private LocalDateTime updatedDate;
    private Integer updatedBy;
    private Integer percent;
    private List<Integer> productIds;
    public DiscountEntity toEntity() {
        DiscountEntity discountEntity = new DiscountEntity();
        discountEntity.setId(id);
        discountEntity.setCode(code);
        discountEntity.setName(name);
        discountEntity.setDescription(description);
        discountEntity.setType(type);
        discountEntity.setMoneyDiscount(type == 1 ? 0 : moneyDiscount);
        discountEntity.setStartDate(startDate);
        discountEntity.setEndDate(endDate);
        discountEntity.setStatus(status);
        discountEntity.setIsDeleted(isDeleted);
        discountEntity.setCreatedDate(createdDate);
        discountEntity.setCreatedBy(createdBy);
        discountEntity.setUpdatedDate(updatedDate);
        discountEntity.setUpdatedBy(updatedBy);
        discountEntity.setPercent(type == 2 ? 0 : percent);
        return discountEntity;
    }
}
