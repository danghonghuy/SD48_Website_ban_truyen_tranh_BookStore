package com.example.backend_comic_service.develop.utils; // Hoặc package đúng của bạn

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCodeConst {
    // Lỗi nghiệp vụ chung
    BUSINESS_ERROR("business.error", HttpStatus.BAD_REQUEST.value(), "Lỗi nghiệp vụ"),

    // Lỗi hệ thống
    INTERNAL_SERVER_ERROR("internal.server.error", HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống"),

    // Lỗi xác thực & phân quyền
    UNAUTHORIZED("unauthorized", HttpStatus.UNAUTHORIZED.value(), "Chưa xác thực"),
    PERMISSION_DENIED("permission.denied", HttpStatus.FORBIDDEN.value(), "Không có quyền truy cập"),
    INVALID_CLIENT("invalid.client", HttpStatus.UNAUTHORIZED.value(), "Client không hợp lệ"),

    // Lỗi đầu vào & request
    INVALID_INPUT("invalid.input", HttpStatus.BAD_REQUEST.value(), "Dữ liệu đầu vào không hợp lệ"),
    INVALID_URL_FORMAT("invalid.url.format", HttpStatus.BAD_REQUEST.value(), "Định dạng URL không hợp lệ"),
    NOT_SUPPORTED_METHOD("not.supported.method", HttpStatus.METHOD_NOT_ALLOWED.value(), "Phương thức không được hỗ trợ"),
    NOT_SUPPORTED_MEDIA_TYPE("not.supported.media.type", HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(), "Loại media không được hỗ trợ"),
    MISSING_REQUEST_PARAM("missing.request.param", HttpStatus.BAD_REQUEST.value(),"Thiếu tham số yêu cầu"),
    REQUEST_PARAM_TYPE_MISMATCH("request.param.type.mismatch", HttpStatus.BAD_REQUEST.value(),"Kiểu tham số yêu cầu không khớp"),
    MISSING_REQUEST_HEADER("missing.request.header", HttpStatus.BAD_REQUEST.value(),"Thiếu header yêu cầu"),

    // Lỗi không tìm thấy
    NOT_FOUND_INFO("not.found.info", HttpStatus.NOT_FOUND.value(),"Không tìm thấy thông tin"),
    NOT_FOUND_CATEGORY("not.found.category", HttpStatus.NOT_FOUND.value(),"Không tìm thấy danh mục"),
    NOT_FOUND_TYPE("not.found.type", HttpStatus.NOT_FOUND.value(),"Không tìm thấy loại"),
    NOT_FOUND_POINT("not.found.point", HttpStatus.NOT_FOUND.value(),"Không tìm thấy điểm (nguồn/đích)"),
    NOT_FOUND_FEE("not.found.fee", HttpStatus.NOT_FOUND.value(),"Không tìm thấy mức phí vận chuyển"),
    NOT_FOUND_PRODUCT("not.found.product", HttpStatus.NOT_FOUND.value(), "Không tìm thấy sản phẩm"), // THÊM MỚI (nếu chưa có)
    NOT_FOUND_AUTHOR("not.found.author", HttpStatus.NOT_FOUND.value(), "Không tìm thấy tác giả"),     // THÊM MỚI
    NOT_FOUND_PUBLISHER("not.found.publisher", HttpStatus.NOT_FOUND.value(), "Không tìm thấy nhà xuất bản"), // THÊM MỚI
    NOT_FOUND_DISTRIBUTOR("not.found.distributor", HttpStatus.NOT_FOUND.value(), "Không tìm thấy nhà phát hành"), // THÊM MỚI


    // Lỗi liên quan đến nghiệp vụ cụ thể (ví dụ: Product, User, Order)
    USER_NOT_VALID("user.not.valid", HttpStatus.BAD_REQUEST.value(), "Người dùng không hợp lệ hoặc không hoạt động"),
    UPLOAD_FILE_ERROR("upload.file.error", HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi khi tải lên tệp tin"),
    DATABASE_ERROR("database.error", HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi thao tác cơ sở dữ liệu"),
    PRODUCT_NAME_EXIST("product.name.exist", HttpStatus.BAD_REQUEST.value(), "Tên sản phẩm đã tồn tại"),

    // Lỗi nghiệp vụ shipping fee
    FEE_IS_EXIST("fee.is.exist", HttpStatus.BAD_REQUEST.value(),"Mức phí đã tồn tại"),
    POINT_DESTINATION_IS_EXIST("point.destination.is.exist", HttpStatus.BAD_REQUEST.value(),"Điểm đến đã tồn tại cho nguồn này"),
    POINT_SOURCE_IS_EXIST("point.source.is.exist", HttpStatus.BAD_REQUEST.value(),"Điểm nguồn đã tồn tại cho đích này"),
    INVALID_POINT_SOURCE("invalid.point.source", HttpStatus.BAD_REQUEST.value(), "Mã tỉnh nguồn không hợp lệ"),
    INVALID_POINT_DESTINATION("invalid.point.destination", HttpStatus.BAD_REQUEST.value(), "Mã tỉnh đích không hợp lệ hoặc bị thiếu"),
    UNSUPPORTED_DESTINATION("unsupported.destination", HttpStatus.BAD_REQUEST.value(), "Không hỗ trợ vận chuyển đến tỉnh này hoặc chưa có mức phí");

    private final String code;
    private final int httpCode;
    private final String message;

    public static final String X_API_KEY_HEADER_NAME = "x-api-key";
    public static final String MSG_MISSING_X_API_KEY = "Thiếu thông tin x-api-key";
    public static final String MSG_X_API_KEY_INVALID = "x-api-key không hợp lệ";
    public static final String MSG_MISSING_WRONG_USER_ID = "Thiếu thông tin/Sai định dạng user_id trong header";


    @Override
    public String toString() {
        return "ErrorCodeConst{" +
                "code='" + code + '\'' +
                ", httpCode=" + httpCode +
                ", message='" + message + '\'' +
                '}';
    }
}