// CouponEntity.java
package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.CouponModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
// import org.slf4j.Logger; // Nếu bạn muốn dùng logger riêng, không phải @Slf4j
// import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "coupon")
// @Slf4j // Nếu bạn dùng Lombok cho logging
public class CouponEntity {
    // private static final Logger log = LoggerFactory.getLogger(CouponEntity.class); // Nếu không dùng @Slf4j

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;
    @Column(name = "type")
    private Integer type;
    @Column(name = "percent_value")
    private Integer percentValue;
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "coupon_amount")
    private Integer couponAmount;
    @Column(name = "status")
    private Integer status; // Status này sẽ là status lưu trong DB (có thể không phải là status động)
    @Column(name = "is_delete")
    private Integer isDelete;
    @Column(name = "max_value")
    private Integer maxValue;
    @Column(name = "min_value")
    private Integer minValue;
    @Column(name = "date_start")
    private Instant dateStart;
    @Column(name = "date_end")
    private Instant dateEnd;
    @Column(name = "created_date")
    private Instant createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name =  "updated_date")
    private Instant updatedDate;
    @Column(name = "updated_by")
    private  Integer updated_by;
    @Column(name = "quantity_used")
    private Integer quantityUsed;

    public CouponModel toCouponModel(){
        CouponModel couponModel = new CouponModel();
        couponModel.setId(id);
        couponModel.setCode(code);
        couponModel.setName(name);
        couponModel.setDescription(description);
        couponModel.setType(type);
        couponModel.setPercentValue(percentValue);
        couponModel.setQuantity(quantity);
        couponModel.setCouponAmount(couponAmount);
        // isDelete và các trường khác
        couponModel.setIsDelete(isDelete);
        couponModel.setMaxValue(maxValue);
        couponModel.setMinValue(minValue);
        couponModel.setCreatedBy(createdBy);
        couponModel.setQuantityUsed(quantityUsed);
        // couponModel.setUpdated_by(this.updated_by); // Nếu CouponModel có trường này

        // Chuyển Instant sang String ISO UTC cho CouponModel
        if (this.dateStart != null) {
            couponModel.setDateStart(this.dateStart.toString());
            couponModel.setDateStartEpochTime(this.dateStart.toEpochMilli());
        }
        if (this.dateEnd != null) {
            couponModel.setDateEnd(this.dateEnd.toString());
            couponModel.setDateEndEpochTime(this.dateEnd.toEpochMilli());
        }
        if (this.createdDate != null) {
            couponModel.setCreatedDate(this.createdDate.toString());
        }
        if (this.updatedDate != null) {
            couponModel.setUpdatedDate(this.updatedDate.toString());
        }

        // === TÍNH TOÁN TRẠNG THÁI ĐỘNG ===
        Instant now = Instant.now();
        Integer actualStatus = 2; // Mặc định: Sắp diễn ra

        // Ưu tiên trạng thái đã bị vô hiệu hóa/kết thúc thủ công trong DB
        if (this.status != null && this.status == 0) { // Giả sử 0 là "Đã kết thúc" hoặc "Vô hiệu hóa"
            actualStatus = 0;
        } else if (this.dateStart == null || this.dateEnd == null || (this.dateStart != null && this.dateEnd != null && this.dateEnd.isBefore(this.dateStart))) {
            // Ngày không hợp lệ, có thể giữ nguyên status từ DB hoặc set một trạng thái lỗi
            // log.warn("Coupon ID {} có ngày bắt đầu/kết thúc không hợp lệ khi tính trạng thái động.", this.id);
            actualStatus = this.status != null ? this.status : 2; // Giữ status DB nếu có, nếu không thì là Sắp diễn ra
        } else if (now.isBefore(this.dateStart)) {
            actualStatus = 2; // Sắp diễn ra
        } else if (now.isAfter(this.dateEnd)) {
            actualStatus = 0; // Đã kết thúc (do hết hạn tự nhiên)
        } else { // now is between dateStart and dateEnd
            actualStatus = 1; // Đang diễn ra
        }
        couponModel.setStatus(actualStatus);
        // === KẾT THÚC TÍNH TOÁN TRẠNG THÁI ĐỘNG ===

        return couponModel;
    }
}