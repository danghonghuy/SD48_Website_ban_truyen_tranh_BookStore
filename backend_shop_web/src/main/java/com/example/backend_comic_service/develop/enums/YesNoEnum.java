package com.example.backend_comic_service.develop.enums;

public enum YesNoEnum {
    NO(0, "Không"),
    YES(1, "Có");

    private int value;
    private String description;

    YesNoEnum(int value, String description) {
        this.value = value;
        this.description = description;
    }

    public int getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static YesNoEnum fromValue(int value) {
        for (YesNoEnum code : YesNoEnum.values()) {
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