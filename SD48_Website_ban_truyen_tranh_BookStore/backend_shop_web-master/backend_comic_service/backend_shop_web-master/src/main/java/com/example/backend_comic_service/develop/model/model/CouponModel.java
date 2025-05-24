package com.example.backend_comic_service.develop.model.model;

import lombok.*;
// Bỏ các import không cần thiết liên quan đến format ngày giờ ở đây

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class CouponModel {
    private Integer id;
    private String code;
    private String name;
    private String description;
    private Integer type;
    private Integer percentValue;
    private Integer quantity;
    private Integer couponAmount;
    private Integer status;
    private Integer isDelete;
    private Integer maxValue;
    private Integer minValue;

    // === THAY ĐỔI KIỂU DỮ LIỆU SANG String ===
    // Xóa @DateTimeFormat và @JsonFormat
    private String dateStart;

    // Xóa @DateTimeFormat và @JsonFormat
    private String dateEnd;

    // Xóa @DateTimeFormat và @JsonFormat
    private String createdDate;

    private Integer createdBy;

    // Xóa @DateTimeFormat và @JsonFormat
    private String updatedDate;
    // === KẾT THÚC THAY ĐỔI ===

    private  Integer updated_by;
    private Integer quantityUsed;
    private Long dateStartEpochTime;
    private Long dateEndEpochTime;

    // Phương thức toEntity() trong CouponModel không cần thiết
    // vì CouponModel là DTO để trả về, không phải để chuyển thành Entity.
    // Nếu bạn có logic này ở đâu đó khác, hãy đảm bảo nó phù hợp.
}