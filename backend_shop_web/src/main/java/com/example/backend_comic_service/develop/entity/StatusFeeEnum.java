package com.example.backend_comic_service.develop.entity;

public enum StatusFeeEnum {
    INACTIVE(0, "Dừng hoạt động"),
    ACTIVE(1, "Hoạt động");

    private int value;
    private String description;

    StatusFeeEnum(int value, String description) {
        this.value = value;
        this.description = description;
    }

    public int getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static StatusFeeEnum fromValue(int value) {
        for (StatusFeeEnum code : StatusFeeEnum.values()) {
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