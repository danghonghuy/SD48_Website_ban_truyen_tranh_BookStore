package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.entity.DeliveryEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DeliveryModel;
import com.example.backend_comic_service.develop.model.model.PaymentModel;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IDeliveryService {
    BaseListResponseModel<List<DeliveryModel>> getList(String keySearch, Integer status, Pageable pageable);
    BaseResponseModel<DeliveryModel> addOrChange(DeliveryModel model);
    BaseResponseModel<DeliveryModel> getById(Integer id);
    BaseResponseModel<Integer> delete(Integer id, Integer status);
    BaseResponseModel<String> generateCode();
}
