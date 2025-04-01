package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;


public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public BaseResponseModel<?> handleBindException(BindException e) {
        BaseResponseModel<?> response = new BaseResponseModel<>();
        if (e.getBindingResult().hasErrors())
            e.getBindingResult().getAllErrors().get(0).getDefaultMessage();

        response.errorResponse(e.getBindingResult().getAllErrors().get(0).getDefaultMessage());
        return response;
    }
}
