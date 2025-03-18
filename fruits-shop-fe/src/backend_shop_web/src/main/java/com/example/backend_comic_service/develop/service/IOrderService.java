package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.OrderGetListMapper;
import com.example.backend_comic_service.develop.model.model.OrderModel;
import org.springframework.data.domain.Pageable;

import java.sql.Date;
import java.util.List;

public interface IOrderService {
    BaseResponseModel<Integer> createOrder(OrderModel model);
    BaseListResponseModel<List<OrderGetListMapper>> getListOrders(Integer userId, Integer paymentId, Integer employeeId, Integer status, Integer stage, Integer type, Integer startPrice, Integer endPrice, Date startDate, Date endDate, Pageable pageable);
}
