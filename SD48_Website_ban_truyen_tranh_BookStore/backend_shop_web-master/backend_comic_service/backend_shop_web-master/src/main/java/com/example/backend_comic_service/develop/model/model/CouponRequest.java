package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.CouponEntity;
import lombok.*;
import java.time.Instant; // Cần cho toEntity nếu CouponEntity dùng Instant

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class CouponRequest {
    private Integer id;
    private String code;
    private String name;
    private String description;
    private Integer type;
    private Integer percentValue;
    private Integer quantity;
    private Integer couponAmount = 0;
    // private Integer status; // Status nên do backend quyết định
    // private Integer isDelete;
    private Integer maxValue = 0;
    private Integer minValue;

    // Giữ là String để nhận chuỗi ISO UTC từ frontend
    // Bỏ @JsonFormat
    private String dateStart;

    // Bỏ @JsonFormat
    private String dateEnd;


    public CouponEntity toEntity() {
        CouponEntity couponEntity = new CouponEntity();
        couponEntity.setId(id);
        couponEntity.setCode(code);
        couponEntity.setName(name);
        couponEntity.setDescription(description);
        couponEntity.setType(type);
        couponEntity.setPercentValue(percentValue);
        couponEntity.setQuantity(quantity);
        couponEntity.setCouponAmount(couponAmount);
        couponEntity.setMaxValue(maxValue);
        couponEntity.setMinValue(minValue);

        // Parse String (ISO UTC) thành Instant
        if (this.dateStart != null && !this.dateStart.isEmpty()) {
            couponEntity.setDateStart(Instant.parse(this.dateStart));
        }
        if (this.dateEnd != null && !this.dateEnd.isEmpty()) {
            couponEntity.setDateEnd(Instant.parse(this.dateEnd));
        }
        // quantityUsed, isDelete, status, createdBy, createdDate, updatedBy, updatedDate
        // sẽ được set trong service.
        if (this.id == null) { // Chỉ set khi tạo mới
            couponEntity.setQuantityUsed(0);
            couponEntity.setIsDelete(0);
        }
        return couponEntity;
    }
}