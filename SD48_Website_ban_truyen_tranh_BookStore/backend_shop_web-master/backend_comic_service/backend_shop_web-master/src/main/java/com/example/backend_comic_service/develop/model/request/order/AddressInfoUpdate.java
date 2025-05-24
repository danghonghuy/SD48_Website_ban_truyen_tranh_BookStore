package com.example.backend_comic_service.develop.model.request.order;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AddressInfoUpdate {

    @Size(max = 10, message = "Mã tỉnh/thành phố không được vượt quá 10 ký tự.")
    private String provinceId;

    @Size(max = 10, message = "Mã quận/huyện không được vượt quá 10 ký tự.")
    private String districtId;

    @Size(max = 10, message = "Mã xã/phường không được vượt quá 10 ký tự.")
    private String wardId;

    @Size(max = 255, message = "Địa chỉ chi tiết không được vượt quá 255 ký tự.")
    private String addressDetail;

    @Size(max = 100, message = "Tên tỉnh/thành phố không được vượt quá 100 ký tự.")
    private String provinceName;

    @Size(max = 100, message = "Tên quận/huyện không được vượt quá 100 ký tự.")
    private String districtName;

    @Size(max = 100, message = "Tên xã/phường không được vượt quá 100 ký tự.")
    private String wardName;
}