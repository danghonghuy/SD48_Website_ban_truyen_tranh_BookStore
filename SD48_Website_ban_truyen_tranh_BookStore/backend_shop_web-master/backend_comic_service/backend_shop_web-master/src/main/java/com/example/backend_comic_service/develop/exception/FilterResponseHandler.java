package com.example.backend_comic_service.develop.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.example.backend_comic_service.develop.utils.ErrorCodeConst;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class FilterResponseHandler {
    private FilterResponseHandler() {
    }

    public static void returnError(ServletResponse response, ErrorCodeConst errorCodeConst,
                                   String message, Object errorDetail, ResponseFactory responseFactory) throws IOException {
        var mapper = new ObjectMapper();
        var httpServletResponse = (HttpServletResponse) response;
        ResponseEntity<Object> responseEntity = responseFactory.fail(errorDetail, errorCodeConst, message);
        httpServletResponse.setStatus(responseEntity.getStatusCodeValue());
        httpServletResponse.setCharacterEncoding(StandardCharsets.UTF_8.name());
        httpServletResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
        mapper.writeValue(httpServletResponse.getOutputStream(), responseEntity.getBody());
    }
}
