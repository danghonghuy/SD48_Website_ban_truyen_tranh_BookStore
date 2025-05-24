package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.OrderGetListMapper;
import com.example.backend_comic_service.develop.model.model.OrderModel;
// Import DTO mới
import com.example.backend_comic_service.develop.model.request.order.OrderUpdateRequest;
import com.example.backend_comic_service.develop.service.IOrderDetailService;
import com.example.backend_comic_service.develop.service.IOrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid; // Import cho @Valid
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    // private Integer type; // Biến instance 'type' này có vẻ không cần thiết và có thể gây nhầm lẫn nếu controller là singleton

    @Autowired
    ObjectMapper objectMapper;


    @PostMapping("/create-order")
    public BaseResponseModel<Integer> createOrder(@RequestBody OrderModel model) throws JsonProcessingException {
        log.info("Controller: Yêu cầu createOrder: {}", objectMapper.writeValueAsString(model));
        return orderService.createOrder(model);
    }

    @GetMapping("/get-by-order-id")
    public BaseResponseModel<OrderModel> getByOrderIds(@RequestParam(name = "id") Integer id) { // Nên để id là bắt buộc
        log.info("Controller: Yêu cầu getByOrderIds với ID: {}", id);
        return orderDetailService.getDetail(id);
    }

    @GetMapping("/get-list-order")
    // SỬA KIỂU TRẢ VỀ Ở ĐÂY: T_ITEM của BaseListResponseModel là OrderGetListMapper
    public BaseListResponseModel<OrderGetListMapper> getListOrder(
            @RequestParam(name = "userId", required = false) Integer userId,
            @RequestParam(name = "paymentId", required = false) Integer paymentId,
            @RequestParam(name = "employeeId", required = false) Integer employeeId,
            @RequestParam(name = "status", required = false) Integer status,
            @RequestParam(name = "stage", required = false) Integer stage,
            @RequestParam(name = "type", required = false) Integer type,
            @RequestParam(name = "startPrice", required = false) Integer startPrice,
            @RequestParam(name = "endPrice", required = false) Integer endPrice,
            @RequestParam(name = "startDate", required = false) LocalDateTime startDate,
            @RequestParam(name = "endDate", required = false) LocalDateTime endDate,
            @RequestParam(name = "pageIndex", defaultValue = "1") Integer pageIndex,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {

        // Log các tham số (có thể dùng objectMapper để log filter nếu bạn dùng DTO sau này)
        log.info("Controller: Yêu cầu getListOrder với các tham số: userId={}, paymentId={}, employeeId={}, status={}, stage={}, type={}, startPrice={}, endPrice={}, startDate={}, endDate={}, pageIndex={}, pageSize={}",
                userId, paymentId, employeeId, status, stage, type, startPrice, endPrice, startDate, endDate, pageIndex, pageSize);

        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize, Sort.by("orderId").descending()); // Giả sử sắp xếp theo orderId của OrderEntity

        // Gọi service, giờ đây nó sẽ trả về đúng kiểu BaseListResponseModel<OrderGetListMapper>
        return orderService.getListOrders(userId, paymentId, employeeId, status, stage, type, startPrice, endPrice, startDate, endDate, pageable);    }

    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        log.info("Controller: Yêu cầu generateCode");
        return orderService.generateCode();
    }

    // Đã sửa: Đổi thành @PutMapping, id là path variable, status và note là request param
    @PutMapping("/{id}/change-status")
    public ResponseEntity<BaseResponseModel<Integer>> changeStatus(
            @PathVariable("id") Integer id,
            @RequestParam(value = "status") OrderStatusEnum status,
            @RequestParam(value = "note", required = false) String note) {

        log.info("Controller: Yêu cầu changeStatus cho ID: {}, Status enum: {}, Note: {}", id, status, note);
        BaseResponseModel<Integer> response = orderService.updateStatus(id, status, note);
        if (response.isSuccess()) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            // Dựa vào lỗi cụ thể từ service để trả về status code phù hợp hơn (ví dụ: NOT_FOUND, BAD_REQUEST)
            // Tạm thời vẫn để BAD_REQUEST cho các lỗi nghiệp vụ chung
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    // === ENDPOINT MỚI ĐỂ CẬP NHẬT THÔNG TIN ĐƠN HÀNG ===
    @PutMapping("/{id}/update-information")
    public ResponseEntity<BaseResponseModel<Integer>> updateOrderInformation(
            @PathVariable("id") Integer orderId,
            @Valid @RequestBody OrderUpdateRequest updateRequest) { // Sử dụng @Valid để kích hoạt validation
        log.info("Controller: Yêu cầu updateOrderInformation cho Order ID: {}", orderId);
        try {
            log.debug("Payload nhận được: {}", objectMapper.writeValueAsString(updateRequest));
        } catch (JsonProcessingException e) {
            log.warn("Không thể serialize payload updateRequest: {}", e.getMessage());
        }

        BaseResponseModel<Integer> response = orderService.updateOrderInformation(orderId, updateRequest);
        if (response.isSuccess()) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            // Tương tự như changeStatus, có thể trả về status code cụ thể hơn
            // Ví dụ: nếu ResourceNotFoundException -> HttpStatus.NOT_FOUND
            // Nếu InsufficientStockException -> HttpStatus.CONFLICT hoặc HttpStatus.BAD_REQUEST
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}