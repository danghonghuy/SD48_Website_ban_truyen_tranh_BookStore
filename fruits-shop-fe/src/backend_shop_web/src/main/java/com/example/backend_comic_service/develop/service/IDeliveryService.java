package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.entity.DeliveryEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;

import java.util.List;

public interface IDeliveryService {
    BaseListResponseModel<List<DeliveryEntity>> getList();
}
