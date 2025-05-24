package com.example.backend_comic_service.develop.enums;

public enum OrderStatusEnum {
    ORDER_STATUS_WAITING_ACCEPT(1, "Chờ xác nhận"),
    ORDER_STATUS_ACCEPT(2, "Đã xác nhận"),
    ORDER_STATUS_DELIVERY(3, "Chờ vận chuyển"),
    ORDER_STATUS_FINISH_DELIVERY(4, "Đang vận chuyển"),
    ORDER_STATUS_SUCCESS(5, "Hoàn thành"),
    ORDER_STATUS_CUSTOMER_CANCEL(6, "Khách hàng hủy đơn"), // Đổi mô tả nếu cần
    ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE(7, "Không nhận hàng"), // Hoặc "Giao hàng thất bại"
    ORDER_STATUS_FAIL(8, "Tạo đơn thất bại"), // Hoặc một trạng thái lỗi chung khác

    ORDER_STATUS_SHOP_CANCEL(9, "Shop hủy đơn"); // <<<< THÊM HẰNG SỐ NÀY

    private Integer value; // Nên là final
    private String description; // Nên là final

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
        if (value == null) { // Thêm kiểm tra null cho value
            return null; // Hoặc throw IllegalArgumentException tùy theo yêu cầu
        }
        for (OrderStatusEnum code : OrderStatusEnum.values()) {
            // Sử dụng equals() để so sánh Integer, mặc dù == thường hoạt động với Integer cache
            if (code.value.equals(value)) {
                return code;
            }
        }
        throw new IllegalArgumentException("Invalid OrderStatusEnum value: " + value);
    }

    // Phương thức toString() mặc định của Enum thường trả về tên hằng số (ví dụ: "ORDER_STATUS_SHOP_CANCEL")
    // Ghi đè toString() như hiện tại sẽ trả về "9 - Shop hủy đơn"
    // Điều này không ảnh hưởng đến việc Spring Boot parse từ String sang Enum bằng valueOf(String name)
    @Override
    public String toString() {
        return value + " - " + description;
    }
}