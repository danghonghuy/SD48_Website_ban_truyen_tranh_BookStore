package com.example.backend_comic_service.develop.exception;

import com.example.backend_comic_service.develop.utils.ErrorCodeConst;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;

import java.util.Locale;

@Getter
@Slf4j
public class ServiceException extends RuntimeException {
    protected String source;
    protected String[] arguments;
    private Integer httpStatus;
    private String errorCode;
    private String message;

    public ServiceException(ErrorCodeConst errorEnum, String message, String... args) {
        super(String.format(errorEnum.getMessage(), (Object[]) args));
        this.httpStatus = errorEnum.getHttpCode();
        this.errorCode = errorEnum.getCode();
        if (message == null || message.isEmpty()) {
            this.message = String.format(errorEnum.getMessage(), (Object[]) args);
        } else {
            this.message = String.format(message, (Object[]) args);
        }
        this.arguments = args;
    }

    public ServiceException(int httpStatus, String errorCode, String message, String... args) {
        super(String.format(message, (Object[]) args));
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        if (args != null) {
            this.message = String.format(message, (Object[]) args);
        } else {
            this.message = message;
        }
        this.arguments = args;
    }

    public ServiceRestError transformToRestError(MessageSource messageSource, Locale locale) {
        var restError = new ServiceRestError();
        restError.setCode(errorCode);
        try {
            String errorMessage = messageSource.getMessage(this.message, this.arguments, locale);
            restError.setMessage(errorMessage);
        } catch (NoSuchMessageException e) {
            restError.setMessage(this.message);
        }
        restError.setException(this.getClass().getName());
        return restError;
    }

    public static class RetryableException extends RuntimeException {
        public RetryableException(String message) {
            super(message);
        }
    }
}
