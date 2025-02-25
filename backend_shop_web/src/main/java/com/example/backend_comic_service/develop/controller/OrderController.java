package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.OrderDetailGetListMapper;
import com.example.backend_comic_service.develop.model.mapper.OrderGetListMapper;
import com.example.backend_comic_service.develop.model.model.OrderModel;
import com.example.backend_comic_service.develop.service.IOrderDetailService;
import com.example.backend_comic_service.develop.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {
    @Autowired
    private IOrderService orderService;
    @Autowired
    private IOrderDetailService orderDetailService;

    @PostMapping("/create-order")
    BaseResponseModel<Integer> createOrder(@RequestBody OrderModel model) {
        return orderService.createOrder(model);
    }

    @GetMapping("/get-by-order-id/{id}")
    BaseListResponseModel<List<OrderDetailGetListMapper>> getByOrderIds(@PathVariable Integer id) {
        return orderDetailService.getListByOrderId(id);
    }

    @GetMapping("/get-list-order")
    public BaseResponseModel<List<OrderGetListMapper>> getListOrder(@RequestParam(name = "userId", required = false) Integer userId,
                                                                    @RequestParam(name = "paymentId", required = false) Integer paymentId,
                                                                    @RequestParam(name = "employeeId", required = false) Integer employeeId,
                                                                    @RequestParam(name = "status", required = false) Integer status,
                                                                    @RequestParam(name = "stage", required = false) Integer stage,
                                                                    @RequestParam(name = "type", required = false) Integer type,
                                                                    @RequestParam(name = "startPrice", required = false) Integer startPrice,
                                                                    @RequestParam(name = "endPrice", required = false) Integer endPrice,
                                                                    @RequestParam(name = "startDate", required = false) Date startDate,
                                                                    @RequestParam(name = "endDate", required = false) Date endDate,
                                                                    @RequestParam(name = "pageIndex", required = true) Integer pageIndex,
                                                                    @RequestParam(name = "pageSize", required = true) Integer pageSize) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        return orderService.getListOrders(userId, paymentId, employeeId, status, stage, type, startPrice, endPrice, startDate, endDate, pageable);
    }
}
