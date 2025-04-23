package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.entity.OrderEntity;
import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.OrderDetailGetListMapper;
import com.example.backend_comic_service.develop.model.mapper.OrderGetListMapper;
import com.example.backend_comic_service.develop.model.model.OrderModel;
import com.example.backend_comic_service.develop.service.IOrderDetailService;
import com.example.backend_comic_service.develop.service.IOrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/order")
public class OrderController {
    @Autowired
    private IOrderService orderService;
    @Autowired
    private IOrderDetailService orderDetailService;
    private Integer type;

    @Autowired
    ObjectMapper objectMapper;


    @PostMapping("/create-order")
    BaseResponseModel<Integer> createOrder(@RequestBody OrderModel model) throws JsonProcessingException {
        log.info(objectMapper.writeValueAsString(model));
        return orderService.createOrder(model);
    }

    @GetMapping("/get-by-order-id")
    BaseResponseModel<OrderModel> getByOrderIds(@RequestParam(name = "id", required = false) Integer id) {
        return orderDetailService.getDetail(id);
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
                                                                    @RequestParam(name = "startDate", required = false) LocalDateTime startDate,
                                                                    @RequestParam(name = "endDate", required = false) LocalDateTime endDate,
                                                                    @RequestParam(name = "pageIndex", required = true) Integer pageIndex,
                                                                    @RequestParam(name = "pageSize", required = true) Integer pageSize) {
        this.type = type;
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize, Sort.by("orderId").descending());
        return orderService.getListOrders(userId, paymentId, employeeId, status, stage, type, startPrice, endPrice, startDate, endDate, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return orderService.generateCode();
    }
    @GetMapping("/change-status")
    public BaseResponseModel<Integer> changeStatus(@RequestParam(value = "id", required = false) Integer id,
                                             @RequestParam(value = "status",  required = false) OrderStatusEnum status,
                                             @RequestParam(value = "description",  required = false) String description) {
        return orderService.updateStatus(id, status, description);
    }
}
