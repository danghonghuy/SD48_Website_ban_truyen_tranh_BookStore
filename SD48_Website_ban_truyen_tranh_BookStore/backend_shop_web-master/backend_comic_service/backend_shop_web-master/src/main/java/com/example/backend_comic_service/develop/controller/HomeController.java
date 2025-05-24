package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.model.dto.StatisticalDTO;
import com.example.backend_comic_service.develop.model.dto.StatisticalOrdersDTO;
import com.example.backend_comic_service.develop.model.dto.StatisticalOrdersDetailDTO;
import com.example.backend_comic_service.develop.repository.OrderDetailRepository;
import com.example.backend_comic_service.develop.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/home")
public class HomeController {
    private static final Logger log = LoggerFactory.getLogger(HomeController.class);

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderDetailRepository orderDetailRepository;

    @GetMapping(value = "/{type}/statistical")
    public StatisticalDTO statistical(@PathVariable String type,
                                      @RequestParam(name = "fromDate", required = false) String fromDate,
                                      @RequestParam(name = "toDate", required = false) String toDate) {

        List<StatisticalOrdersDTO> statisticalOrdersDTOS = new ArrayList<>();
        StatisticalOrdersDetailDTO statisticalOrdersDetailDTO = new StatisticalOrdersDetailDTO();
        StatisticalDTO statisticalDTO = new StatisticalDTO();

        try {
            if ("TODAY".equalsIgnoreCase(type)) {
                statisticalOrdersDTOS = orderRepository.getStatisticalToday();
                statisticalOrdersDetailDTO = orderDetailRepository.getStatisticalToday();
            } else if ("MONTH".equalsIgnoreCase(type)) {
                statisticalOrdersDTOS = orderRepository.getStatisticalMonth();
                statisticalOrdersDetailDTO = orderDetailRepository.getStatisticalMonth();
            } else if ("WEEK".equalsIgnoreCase(type)) {
                statisticalOrdersDTOS = orderRepository.getStatisticalWeek();
                statisticalOrdersDetailDTO = orderDetailRepository.getStatisticalWeek();
            } else if ("YEAR".equalsIgnoreCase(type)) {
                statisticalOrdersDTOS = orderRepository.getStatisticalYear();
                statisticalOrdersDetailDTO = orderDetailRepository.getStatisticalYear();
            } else if ("FT".equalsIgnoreCase(type)) {
                if (fromDate == null || toDate == null) {
                    statisticalDTO.setMessage("fromDate và toDate là bắt buộc cho loại lọc FT.");
                    log.warn("Yêu cầu thống kê FT thiếu fromDate hoặc toDate.");
                    return statisticalDTO;
                }
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                LocalDateTime dateFrom = LocalDateTime.parse(fromDate, formatter);
                LocalDateTime dateTo = LocalDateTime.parse(toDate, formatter);
                statisticalOrdersDTOS = orderRepository.getStatisticalFromTo(dateFrom, dateTo);
                statisticalOrdersDetailDTO = orderDetailRepository.getStatisticalFromTo(dateFrom, dateTo);
            } else {
                statisticalDTO.setMessage("Loại lọc không hợp lệ: " + type);
                log.warn("Loại lọc không hợp lệ: {}", type);
                return statisticalDTO;
            }
        } catch (DateTimeParseException e) {
            statisticalDTO.setMessage("Định dạng ngày tháng không hợp lệ. Vui lòng sử dụng yyyy-MM-dd HH:mm:ss.");
            log.warn("Lỗi parse ngày tháng: {}", e.getMessage());
            return statisticalDTO;
        } catch (Exception e) {
            statisticalDTO.setMessage("Lỗi khi lấy dữ liệu thống kê: " + e.getMessage());
            log.error("Lỗi không xác định khi lấy dữ liệu thống kê cho type {}: {}", type, e.getMessage(), e);
            return statisticalDTO;
        }

        if (statisticalOrdersDetailDTO == null) {
            statisticalOrdersDetailDTO = new StatisticalOrdersDetailDTO();
        }

        Map<Integer, Integer> resultMap = statisticalOrdersDTOS.stream()
                .collect(Collectors.toMap(
                        StatisticalOrdersDTO::getStatus,
                        dto -> dto.getTotalCount() == null ? 0 : dto.getTotalCount()
                ));

        statisticalDTO.setTotalRevenue(statisticalOrdersDetailDTO.getTotalRevenue() == null ? 0L : statisticalOrdersDetailDTO.getTotalRevenue().longValue());
        statisticalDTO.setTotalQuantity(statisticalOrdersDetailDTO.getTotalQuantity() == null ? 0 : statisticalOrdersDetailDTO.getTotalQuantity());
        statisticalDTO.setTotalSuccess(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_SUCCESS.getValue(), 0));

        int customerCancelCount = resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL.getValue(), 0);
        int customerCancelReceiveCount = resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE.getValue(), 0);
        int shopCancelCount = 0;
        try {
            shopCancelCount = resultMap.getOrDefault(OrderStatusEnum.valueOf("ORDER_STATUS_SHOP_CANCEL").getValue(), 0);
        } catch (IllegalArgumentException e) {
            log.warn("OrderStatusEnum.ORDER_STATUS_SHOP_CANCEL chưa được định nghĩa hoặc không có dữ liệu.");
        }
        statisticalDTO.setTotalCancel(customerCancelCount + customerCancelReceiveCount + shopCancelCount);

        statisticalDTO.setTotalWaiting(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_WAITING_ACCEPT.getValue(), 0));
        statisticalDTO.setTotalAccept(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue(), 0));
        statisticalDTO.setTotalDelivery(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_DELIVERY.getValue(), 0));
        statisticalDTO.setTotalFinishDelivery(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY.getValue(), 0));

        int failCount = 0;
        try {
            failCount = resultMap.getOrDefault(OrderStatusEnum.valueOf("ORDER_STATUS_FAIL").getValue(), 0);
        } catch (IllegalArgumentException e) {
            log.warn("OrderStatusEnum.ORDER_STATUS_FAIL chưa được định nghĩa hoặc không có dữ liệu.");
        }
        statisticalDTO.setTotalFail(failCount);
        statisticalDTO.setMessage("Lấy dữ liệu thống kê thành công."); // Thêm message thành công
        return statisticalDTO;
    }
}