package com.example.backend_comic_service.develop.configs.configs_sercurity_service;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class LocalDateDeserializer extends StdDeserializer<LocalDate> {

    // Định dạng ngày mà FE gửi lên (YYYY-MM-DD)
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    public LocalDateDeserializer() {
        super(LocalDate.class);
    }

    @Override
    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt)
            throws IOException {
        String value = p.getText();
        if (value == null || value.trim().isEmpty()) {
            // Bạn có thể quyết định trả về null hoặc ném lỗi nếu ngày là bắt buộc
            return null;
        }
        try {
            // Parse chuỗi ngày bằng định dạng đã định nghĩa
            return LocalDate.parse(value, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            // Ném lỗi rõ ràng nếu không parse được
            throw new IOException("Không thể parse ngày: '" + value + "'. Định dạng mong đợi là YYYY-MM-DD.", e);
        }
    }
}