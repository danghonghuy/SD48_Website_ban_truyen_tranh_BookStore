package com.example.backend_comic_service.develop.configs.configs_sercurity_service;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer; // Import serializer
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary; // Thêm Primary nếu có nhiều ObjectMapper beans
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.TimeZone; // Import TimeZone

@Configuration
public class JacksonConfig {

    // Giữ nguyên bean jackson2ObjectMapperBuilder nếu bạn cần cho LocalDateDeserializer
    @Bean
    public Jackson2ObjectMapperBuilder jackson2ObjectMapperBuilder() {
        return new Jackson2ObjectMapperBuilder()
                .deserializerByType(LocalDate.class, new LocalDateDeserializer());
    }
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        JavaTimeModule javaTimeModule = new JavaTimeModule();

        // Định dạng LocalDateTime ra ISO UTC có 'Z'
        DateTimeFormatter localDateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZone(ZoneOffset.UTC);
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(localDateTimeFormatter));
        // Nếu bạn đã chuyển Entity sang dùng Instant, dòng trên không cần thiết cho Instant
        // Jackson sẽ tự serialize Instant ra có 'Z'

        mapper.registerModule(javaTimeModule);
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.setTimeZone(TimeZone.getTimeZone("UTC")); // Quan trọng
        return mapper;
    }
}