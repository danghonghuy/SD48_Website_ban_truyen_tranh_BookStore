package com.example.backend_comic_service.develop.enums;

public enum OrderStatusEnum {
    ORDER_STATUS_WAITING_ACCEPT(1, "Chờ xác nhận"),
    ORDER_STATUS_ACCEPT(2, "Đã xác nhận"),
    ORDER_STATUS_DELIVERY(3, "Chờ vận chuyển"),
    ORDER_STATUS_FINISH_DELIVERY(4, "Đang vận chuyển"),
    ORDER_STATUS_SUCCESS(5, "Hoàn thành"),
    ORDER_STATUS_FAIL(8, "Tạo đơn thất bại"),
    ORDER_STATUS_CUSTOMER_CANCEL(6, "Hủy đơn"),
    ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE(7, "Không nhận hàng"),
    ;

    private Integer value;
    private String description;

    OrderStatusEnum(Integer value, String description) {
        this.value = value;
        this.description = description;
    }

    public Integer getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static OrderStatusEnum fromValue(Integer value) {
        for (OrderStatusEnum code : OrderStatusEnum.values()) {
            if (code.value == value) {
                return code;
            }
        }
        throw new IllegalArgumentException("Invalid StatusCode value: " + value);
    }

    @Override
    public String toString() {
        return value + " - " + description;
    }
}
