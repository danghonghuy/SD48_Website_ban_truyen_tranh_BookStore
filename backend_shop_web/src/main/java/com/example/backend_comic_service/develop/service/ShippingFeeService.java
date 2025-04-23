package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.enums.StatusFeeEnum;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.dto.ShippingFeeDTO;
import com.example.backend_comic_service.develop.model.request.shipping_fee.ShippingFeeModel;
import com.example.backend_comic_service.develop.model.request.shipping_fee.ShippingFeeUpdate;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ShippingFeeService {
    ShippingFeeDTO create(ShippingFeeModel model);

    ShippingFeeDTO update(Long feeId, ShippingFeeUpdate model) throws Exception;

    ShippingFeeDTO detail(Long feeId);

    BaseListResponseModel<List<ShippingFeeDTO>> getPage(String keySearch, StatusFeeEnum status, Pageable pageable);

    Double getFee(String pointSource, String pointDestination);
}
