package com.example.backend_comic_service.develop.model.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class StatisticalDTO {
    private Long totalRevenue;
    private Integer totalQuantity;
    private Integer totalSuccess;
    private Integer totalCancel;
    private Integer totalWaiting;
    private Integer totalAccept;
    private Integer totalDelivery;
    private Integer totalFinishDelivery;
    private Integer totalFail;
    private String message;

//    ORDER_STATUS_WAITING_ACCEPT(1, "Chờ xác nhận"),
//    ORDER_STATUS_ACCEPT(2, "Đã xác nhận"),
//    ORDER_STATUS_DELIVERY(3, "Chờ vận chuyển"),
//    ORDER_STATUS_FINISH_DELIVERY(4, "Đang vận chuyển"),
//    ORDER_STATUS_SUCCESS(5, "Hoàn thành"),
//    ORDER_STATUS_FAIL(8, "Tạo đơn thất bại"),
//    ORDER_STATUS_CUSTOMER_CANCEL(6, "Hủy đơn"),
//    ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE(7, "Không nhận hàng"),
}
