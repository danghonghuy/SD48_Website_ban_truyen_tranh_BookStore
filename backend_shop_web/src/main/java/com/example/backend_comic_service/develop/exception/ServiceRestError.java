package com.example.backend_comic_service.develop.exception;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ServiceRestError implements Serializable {
    private String code;
    private String message;
    private String[] arguments;
    private Long timestamp = System.currentTimeMillis();
    private String exception;
    private String source;
}
