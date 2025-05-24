package com.example.backend_comic_service.develop.configs.configs_sercurity_service;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;

public class LocalDateTimeDeserializer extends StdDeserializer<LocalDateTime> {

    // Danh sách các định dạng được hỗ trợ, ưu tiên từ cụ thể đến chung chung
    private static final List<DateTimeFormatter> SUPPORTED_FORMATTERS = Arrays.asList(
            DateTimeFormatter.ISO_OFFSET_DATE_TIME, // Hỗ trợ "2011-12-03T10:15:30+01:00" và "2011-12-03T10:15:30.123Z"
            DateTimeFormatter.ISO_LOCAL_DATE_TIME,  // Hỗ trợ "2011-12-03T10:15:30" hoặc "2011-12-03T10:15:30.123"
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS"), // Hỗ trợ mili giây không có Z
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
            DateTimeFormatter.ISO_LOCAL_DATE        // Hỗ trợ "2011-12-03" (sẽ được chuyển thành LocalDateTime với giờ 00:00:00)
    );

    public LocalDateTimeDeserializer() {
        super(LocalDateTime.class);
    }

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt)
            throws IOException {
        String value = p.getText();
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        for (DateTimeFormatter formatter : SUPPORTED_FORMATTERS) {
            try {
                if (formatter == DateTimeFormatter.ISO_LOCAL_DATE) {
                    // Nếu là định dạng chỉ ngày, chuyển thành LocalDateTime vào đầu ngày
                    LocalDate localDate = LocalDate.parse(value, formatter);
                    return LocalDateTime.of(localDate, LocalTime.MIN);
                } else {
                    // Thử parse với các định dạng ngày giờ khác
                    // Đối với ISO_OFFSET_DATE_TIME, nó sẽ tự động chuyển về múi giờ của hệ thống nếu có offset
                    // Hoặc bạn có thể muốn chuyển nó về UTC rồi mới lấy LocalDateTime nếu cần
                    // Ví dụ: ZonedDateTime.parse(value, formatter).withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime();
                    return LocalDateTime.parse(value, formatter);
                }
            } catch (DateTimeParseException e) {
                // Bỏ qua và thử formatter tiếp theo
            }
        }

        // Nếu không có formatter nào phù hợp, ném lỗi
        throw new IOException(String.format("Không thể parse ngày giờ: '%s'. Các định dạng được hỗ trợ bao gồm ISO 8601 (ví dụ: 2023-10-26T10:15:30Z, 2023-10-26T10:15:30), yyyy-MM-dd HH:mm:ss, yyyy-MM-dd.", value));
    }
}