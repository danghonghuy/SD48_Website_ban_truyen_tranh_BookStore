package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.enums.StatusFeeEnum;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.dto.ShippingFeeDTO;
import com.example.backend_comic_service.develop.model.request.shipping_fee.ShippingFeeModel;
import com.example.backend_comic_service.develop.model.request.shipping_fee.ShippingFeeUpdate;
import org.springframework.data.domain.Pageable;

// import java.util.List; // Không cần cho getPage nếu đã sửa

public interface ShippingFeeService { // Giữ nguyên tên interface
    ShippingFeeDTO create(ShippingFeeModel model);

    ShippingFeeDTO update(Long feeId, ShippingFeeUpdate model) throws Exception;

    ShippingFeeDTO detail(Long feeId);

    BaseListResponseModel<ShippingFeeDTO> getPage(String keySearch, StatusFeeEnum status, Pageable pageable); // Sửa ở đây

    Double getFee(String pointSource, String pointDestination);
}