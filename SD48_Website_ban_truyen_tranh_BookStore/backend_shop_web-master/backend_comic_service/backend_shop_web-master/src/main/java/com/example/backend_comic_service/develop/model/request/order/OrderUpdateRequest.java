package com.example.backend_comic_service.develop.model.request.order;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data // Bao gồm @ToString, @EqualsAndHashCode, @Getter, @Setter, @RequiredArgsConstructor
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true) // Bỏ qua các trường không xác định trong JSON request
public class OrderUpdateRequest {

    @Valid // Validate các trường bên trong CustomerInfoUpdate
    private CustomerInfoUpdate customerInfo;

    @Valid // Validate các trường bên trong AddressInfoUpdate
    private AddressInfoUpdate addressInfo; // Trường mới để chứa thông tin địa chỉ chi tiết

    @Valid // Validate từng ProductItemUpdate trong danh sách
    // Cân nhắc bỏ @NotEmpty nếu việc cập nhật không nhất thiết phải gửi lại danh sách sản phẩm
    // hoặc nếu chỉ cập nhật thông tin khách hàng/địa chỉ.
    // Nếu luôn phải gửi lại sản phẩm thì giữ nguyên.
    // @NotEmpty(message = "Danh sách sản phẩm không được để trống khi cập nhật.")
    private List<ProductItemUpdate> products;

    /**
     * Class chứa thông tin cơ bản của khách hàng cần cập nhật.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CustomerInfoUpdate {

        @Size(max = 255, message = "Tên khách hàng không được vượt quá 255 ký tự.")
        private String fullName;

        @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự.")
        // Ví dụ: @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Số điện thoại không đúng định dạng Việt Nam.")
        private String phoneNumber;

        // Trường này có thể không còn cần thiết nếu addressInfo đã đủ chi tiết.
        // Hoặc có thể dùng để FE gửi một chuỗi địa chỉ đã được format sẵn (ít linh hoạt hơn).
        // Nếu không dùng, có thể xóa đi.
        @Size(max = 500, message = "Địa chỉ giao hàng (dạng chuỗi) không được vượt quá 500 ký tự.")
        private String shippingAddress;
    }

    /**
     * Class chứa thông tin chi tiết về địa chỉ cần cập nhật.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AddressInfoUpdate {

        // Các trường ID có thể không cần @NotNull nếu việc cập nhật địa chỉ
        // cho phép chỉ thay đổi một vài phần (ví dụ chỉ addressDetail).
        // Tuy nhiên, nếu thay đổi tỉnh/huyện/xã thì các ID này là bắt buộc.
        // Validation này có thể được xử lý ở tầng service.

        @Size(max = 10, message = "Mã tỉnh/thành phố không được vượt quá 10 ký tự.")
        private String provinceId;

        @Size(max = 10, message = "Mã quận/huyện không được vượt quá 10 ký tự.")
        private String districtId;

        @Size(max = 10, message = "Mã xã/phường không được vượt quá 10 ký tự.")
        private String wardId;

        @Size(max = 255, message = "Địa chỉ chi tiết không được vượt quá 255 ký tự.")
        private String addressDetail; // Số nhà, tên đường

        // Các trường tên này FE gửi lên để BE có thể lưu lại,
        // giúp việc hiển thị ở các nơi khác không cần join nhiều bảng.
        @Size(max = 100, message = "Tên tỉnh/thành phố không được vượt quá 100 ký tự.")
        private String provinceName;

        @Size(max = 100, message = "Tên quận/huyện không được vượt quá 100 ký tự.")
        private String districtName;

        @Size(max = 100, message = "Tên xã/phường không được vượt quá 100 ký tự.")
        private String wardName;
    }

    /**
     * Class chứa thông tin sản phẩm cần cập nhật trong đơn hàng.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ProductItemUpdate {

        @NotNull(message = "ID sản phẩm không được để trống.")
        private Integer productId;

        @NotNull(message = "Số lượng sản phẩm không được để trống.")
        @Positive(message = "Số lượng sản phẩm phải là số dương.")
        private Integer quantity;
    }
}