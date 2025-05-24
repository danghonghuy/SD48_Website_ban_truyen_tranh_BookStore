// src/main/java/com/example/backend_comic_service/develop/exception/DuplicateRecordException.java
package com.example.backend_comic_service.develop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // Hoặc HttpStatus.BAD_REQUEST tùy bạn muốn xử lý thế nào
public class DuplicateRecordException extends RuntimeException {
    public DuplicateRecordException(String message) {
        super(message);
    }
}