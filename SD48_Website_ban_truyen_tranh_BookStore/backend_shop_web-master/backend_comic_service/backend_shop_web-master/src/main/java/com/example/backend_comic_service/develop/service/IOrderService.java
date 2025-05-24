package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.OrderGetListMapper; // Đảm bảo import đúng
import com.example.backend_comic_service.develop.model.model.OrderModel;
import com.example.backend_comic_service.develop.model.request.order.OrderUpdateRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
// import java.util.List; // Không cần List ở đây cho kiểu trả về của getListOrders

public interface IOrderService {
    BaseResponseModel<Integer> createOrder(OrderModel model);

    // SỬA Ở ĐÂY: Kiểu generic của BaseListResponseModel là OrderGetListMapper
    BaseListResponseModel<OrderGetListMapper> getListOrders(
            Integer userId, Integer paymentId, Integer employeeId, Integer status,
            Integer stage, Integer type, Integer startPrice, Integer endPrice,
            LocalDateTime startDate, LocalDateTime endDate, Pageable pageable
    );

    BaseResponseModel<String> generateCode();

    BaseResponseModel<Integer> updateStatus(Integer id, OrderStatusEnum status, String note);

    BaseResponseModel<Integer> updateOrderInformation(Integer orderId, OrderUpdateRequest updateRequest);
}