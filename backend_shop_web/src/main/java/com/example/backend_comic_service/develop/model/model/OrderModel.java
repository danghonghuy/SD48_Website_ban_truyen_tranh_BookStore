package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.LogPaymentHistoryEntity;
import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.enums.YesNoEnum;
import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderModel {
    private Integer id;
    private String code;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY, timezone = "Asia/Ho_Chi_Minh")
    private LocalDate orderDate;
    private Integer userId;
    private Integer paymentId;
    private Double totalPrice;
    private OrderStatusEnum status;
    private Integer stage;
    private Integer feeDelivery;
    private String description;
    private Integer employeeId;
    /// Has two type order: order in counter and order throw website: order in counter type: 1 and website type: 2
    private Integer type;
    private Integer realPrice;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdDate;
    private Integer createdBy;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime updatedDate;
    private Integer updatedBy;
    private Integer addressId;
    private Integer deliveryType;
    private List<OrderDetailModel> orderDetailModels;
    private String couponCode;
    private UserModel userModel;
        /// 1 is customer retail 2 is customer register use service
        private Integer userType;

    private DeliveryModel deliveryModel;
    private PaymentModel paymentModel;
    private AddressModel addressModel;
    private Integer couponId;
    private CouponModel couponModel;
    private List<LogActionOrderModel> logActionOrderModels;
    private YesNoEnum isDeliver = YesNoEnum.NO;
    private List<LogPaymentHistoryModel> logPaymentHistoryModels;
}
