package com.example.backend_comic_service.develop.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCodeConst {
    BUSINESS_ERROR("business.error", HttpStatus.OK.value(), "business.error"),
    INTERNAL_SERVER_ERROR("internal.server.error", HttpStatus.INTERNAL_SERVER_ERROR.value(), "internal.server.error"),
    UNAUTHORIZED("unauthorized", HttpStatus.UNAUTHORIZED.value(), "unauthorized"),
    PERMISSION_DENIED("permission.denied", HttpStatus.FORBIDDEN.value(), "permission.denied"),
    INVALID_INPUT("invalid.input", HttpStatus.BAD_REQUEST.value(), "invalid.input"),
    INVALID_CLIENT("invalid.client", HttpStatus.UNAUTHORIZED.value(), "invalid.client"),
    EXCHANGE_ERROR("exchange.error", HttpStatus.INTERNAL_SERVER_ERROR.value(), "exchange.error"),
    NOT_SUPPORTED_METHOD("not.supported.method", HttpStatus.METHOD_NOT_ALLOWED.value(), "not.supported.method"),
    INVALID_URL_FORMAT("invalid.url.format", HttpStatus.BAD_REQUEST.value(), "invalid.url.format"),
    NOT_SUPPORTED_MEDIA_TYPE("not.supported.media.type", HttpStatus.BAD_REQUEST.value(), "not.supported.media.type"),
    MISSING_REQUEST_PARAM("missing.request.param", HttpStatus.BAD_REQUEST.value(),"missing.request.param"),
    REQUEST_PARAM_TYPE_MISMATCH("request.param.type.mismatch", HttpStatus.BAD_REQUEST.value(),"request.param.type.mismatch"),
    MISSING_REQUEST_HEADER("missing.request.header", HttpStatus.BAD_REQUEST.value(),"missing.request.header"),
    NOT_FOUND_INFO("not.found.info", HttpStatus.BAD_REQUEST.value(),"not.found.info"),
    FEE_IS_EXIST("fee.is.exist", HttpStatus.BAD_REQUEST.value(),"fee.is.exist"),
    POINT_DESTINATION_IS_EXIST("point.destination.is.exist", HttpStatus.BAD_REQUEST.value(),"point.destination.is.exist"),
    POINT_SOURCE_IS_EXIST("point.source.is.exist", HttpStatus.BAD_REQUEST.value(),"point.source.is.exist"),
    NOT_FOUND_POINT("not.found.point", HttpStatus.BAD_REQUEST.value(),"not.found.point"),
    NOT_FOUND_FEE("not.found.fee", HttpStatus.BAD_REQUEST.value(),"not.found.fee"),
    ;

    private final String code;
    private final int httpCode;
    private final String message;

    public static final String X_API_KEY = "x-api-key";
    public static final String MISSING_X_API_KEY = "Thiếu thông tin x-api-key";
    public static final String X_API_KEY_INVALID = "x-api-key không hợp lệ";
    public static final String MISSING_WRONG_USER_ID = "Thiếu thông tin/Sai định dạng user_id trong header";

    @Override
    public String toString() {
        return "ResponseStatus{" +
                "code='" + code + '\'' +
                "httpCode='" + httpCode + '\'' +
                '}';
    }
}