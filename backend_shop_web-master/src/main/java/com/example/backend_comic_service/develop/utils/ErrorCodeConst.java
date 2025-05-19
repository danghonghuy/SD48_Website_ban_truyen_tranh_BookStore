package com.example.backend_comic_service.develop.utils; // Hoặc package đúng của bạn

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCodeConst {
    BUSINESS_ERROR("business.error", HttpStatus.OK.value(), "Lỗi nghiệp vụ"), // Thêm message tiếng Việt nếu muốn
    INTERNAL_SERVER_ERROR("internal.server.error", HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống"),
    UNAUTHORIZED("unauthorized", HttpStatus.UNAUTHORIZED.value(), "Chưa xác thực"),
    PERMISSION_DENIED("permission.denied", HttpStatus.FORBIDDEN.value(), "Không có quyền truy cập"),
    INVALID_INPUT("invalid.input", HttpStatus.BAD_REQUEST.value(), "Dữ liệu đầu vào không hợp lệ"),
    INVALID_CLIENT("invalid.client", HttpStatus.UNAUTHORIZED.value(), "Client không hợp lệ"),
    EXCHANGE_ERROR("exchange.error", HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi trao đổi dữ liệu"),
    NOT_SUPPORTED_METHOD("not.supported.method", HttpStatus.METHOD_NOT_ALLOWED.value(), "Phương thức không được hỗ trợ"),
    INVALID_URL_FORMAT("invalid.url.format", HttpStatus.BAD_REQUEST.value(), "Định dạng URL không hợp lệ"),
    NOT_SUPPORTED_MEDIA_TYPE("not.supported.media.type", HttpStatus.BAD_REQUEST.value(), "Loại media không được hỗ trợ"),
    MISSING_REQUEST_PARAM("missing.request.param", HttpStatus.BAD_REQUEST.value(),"Thiếu tham số yêu cầu"),
    REQUEST_PARAM_TYPE_MISMATCH("request.param.type.mismatch", HttpStatus.BAD_REQUEST.value(),"Kiểu tham số yêu cầu không khớp"),
    MISSING_REQUEST_HEADER("missing.request.header", HttpStatus.BAD_REQUEST.value(),"Thiếu header yêu cầu"),
    NOT_FOUND_INFO("not.found.info", HttpStatus.BAD_REQUEST.value(),"Không tìm thấy thông tin"),
    FEE_IS_EXIST("fee.is.exist", HttpStatus.BAD_REQUEST.value(),"Mức phí đã tồn tại"),
    POINT_DESTINATION_IS_EXIST("point.destination.is.exist", HttpStatus.BAD_REQUEST.value(),"Điểm đến đã tồn tại cho nguồn này"),
    POINT_SOURCE_IS_EXIST("point.source.is.exist", HttpStatus.BAD_REQUEST.value(),"Điểm nguồn đã tồn tại cho đích này"),
    NOT_FOUND_POINT("not.found.point", HttpStatus.BAD_REQUEST.value(),"Không tìm thấy điểm (nguồn/đích)"),
    NOT_FOUND_FEE("not.found.fee", HttpStatus.BAD_REQUEST.value(),"Không tìm thấy mức phí vận chuyển"), // Giữ lại nếu vẫn dùng ở đâu đó
    NOT_FOUND_CATEGORY("not.found.category", HttpStatus.BAD_REQUEST.value(),"Không tìm thấy danh mục"),
    NOT_FOUND_TYPE("not.found.type", HttpStatus.BAD_REQUEST.value(),"Không tìm thấy loại"),

    // THÊM CÁC MÃ LỖI MỚI CHO SHIPPING FEE ĐỘNG VÀO ĐÂY
    INVALID_POINT_SOURCE("invalid.point.source", HttpStatus.BAD_REQUEST.value(), "Mã tỉnh nguồn không hợp lệ"),
    INVALID_POINT_DESTINATION("invalid.point.destination", HttpStatus.BAD_REQUEST.value(), "Mã tỉnh đích không hợp lệ hoặc bị thiếu"),
    UNSUPPORTED_DESTINATION("unsupported.destination", HttpStatus.BAD_REQUEST.value(), "Không hỗ trợ vận chuyển đến tỉnh này hoặc chưa có mức phí");
    // Dấu chấm phẩy ở cuối giá trị enum cuối cùng

    private final String code;        // Mã lỗi dạng chuỗi (ví dụ: "invalid.point.source")
    private final int httpCode;     // Mã HTTP status tương ứng
    private final String message;     // Thông điệp lỗi mặc định (bạn nên cung cấp message tiếng Việt ở đây)

    // Các hằng số String này có thể giữ lại nếu chúng được dùng ở đâu đó cho mục đích khác,
    // nhưng chúng không phải là giá trị của Enum ErrorCodeConst
    public static final String X_API_KEY = "x-api-key";
    public static final String MISSING_X_API_KEY = "Thiếu thông tin x-api-key";
    public static final String X_API_KEY_INVALID = "x-api-key không hợp lệ";
    public static final String MISSING_WRONG_USER_ID = "Thiếu thông tin/Sai định dạng user_id trong header";

    // Không cần định nghĩa lại các hằng số String ở đây nữa nếu chúng đã là giá trị Enum
    // public static final String INVALID_POINT_SOURCE = "invalid.point.source";
    // public static final String INVALID_POINT_DESTINATION = "invalid.point.destination";
    // public static final String UNSUPPORTED_DESTINATION = "unsupported.destination";


    // Phương thức toString() có thể giữ nguyên hoặc tùy chỉnh nếu cần
    @Override
    public String toString() {
        return "ErrorCodeConst{" +
                "code='" + code + '\'' +
                ", httpCode=" + httpCode + // Sửa dấu nháy đơn thành không có cho int
                ", message='" + message + '\'' +
                '}';
    }
}