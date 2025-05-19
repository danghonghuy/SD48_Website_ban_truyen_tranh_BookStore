package com.example.backend_comic_service.develop.configs.configs_sercurity_service;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

public class LocalDateDeserializer extends StdDeserializer<LocalDate> {

    public LocalDateDeserializer() {
        super(LocalDate.class);
    }

    @Override
    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt)
            throws IOException {
        String value = p.getText();
        // Parse the full datetime and extract just the date part
        return Instant.parse(value)
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }
}