package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.entity.OrderEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.OrderDetailGetListMapper;
import com.example.backend_comic_service.develop.model.model.OrderDetailModel;
import com.example.backend_comic_service.develop.model.model.OrderModel;

import java.util.List;

public interface IOrderDetailService {
    int bulkInsertOrderDetail(List<OrderDetailModel> models, OrderEntity orderEntity, UserEntity userEntity, Integer isChangeOrder);
    BaseListResponseModel<List<OrderDetailGetListMapper>> getListByOrderId(Integer orderIds);
    BaseResponseModel<OrderModel> getDetail(Integer id);
}
