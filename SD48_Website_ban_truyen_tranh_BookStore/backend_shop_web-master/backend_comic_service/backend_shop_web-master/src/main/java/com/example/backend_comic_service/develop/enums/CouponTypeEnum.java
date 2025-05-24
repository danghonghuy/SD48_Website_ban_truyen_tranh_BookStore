package com.example.backend_comic_service.develop.enums;

import java.util.Arrays;

public enum CouponTypeEnum {
    COUPON_PERCENT(1, "Giảm theo phần trăm"),   // Loại giảm giá theo %
    COUPON_AMOUNT(2, "Giảm theo số tiền");     // Loại giảm giá theo số tiền cố định
    // Bạn có thể thêm các loại coupon khác ở đây nếu cần

    private final int value;
    private final String description;

    CouponTypeEnum(int value, String description) {
        this.value = value;
        this.description = description;
    }

    public int getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static CouponTypeEnum fromValue(int value) {
        return Arrays.stream(CouponTypeEnum.values())
                .filter(enumType -> enumType.getValue() == value)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid CouponTypeEnum value: " + value));
    }

    public static CouponTypeEnum fromValueOrNull(Integer value) {
        if (value == null) {
            return null;
        }
        return Arrays.stream(CouponTypeEnum.values())
                .filter(enumType -> enumType.getValue() == value)
                .findFirst()
                .orElse(null);
    }

    @Override
    public String toString() {
        return this.value + " - " + this.description;
    }
}