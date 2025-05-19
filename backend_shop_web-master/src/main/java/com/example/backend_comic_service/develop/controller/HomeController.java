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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/home")
public class HomeController {
    @RequestMapping(value = "/index", method = RequestMethod.POST)
    public String Home() {
        return "Hello World";
    }

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderDetailRepository orderDetailRepository;

    @GetMapping(value = "/{type}/statistical")
    public StatisticalDTO statistical(@PathVariable String type, @RequestParam(name = "fromDate", required = false) String fromDate,
                                      @RequestParam(name = "toDate", required = false) String toDate) {
        List<StatisticalOrdersDTO> statisticalOrdersDTOS = new ArrayList<>();
        StatisticalOrdersDetailDTO statisticalOrdersDetailDTO = new StatisticalOrdersDetailDTO();
        StatisticalDTO statisticalDTO = new StatisticalDTO();

        if ("TODAY".equalsIgnoreCase(type)) {
            statisticalOrdersDTOS = orderRepository.getStatisticalToday();
            statisticalOrdersDetailDTO = orderDetailRepository.getStatisticalToday();
        }
        if ("MONTH".equalsIgnoreCase(type)) {
            statisticalOrdersDTOS = orderRepository.getStatisticalMonth();
            statisticalOrdersDetailDTO = orderDetailRepository.getStatisticalMonth();
        }
        if ("WEEK".equalsIgnoreCase(type)) {
            statisticalOrdersDTOS = orderRepository.getStatisticalWeek();
            statisticalOrdersDetailDTO = orderDetailRepository.getStatisticalWeek();
        }
        if ("YEAR".equalsIgnoreCase(type)) {
            statisticalOrdersDTOS = orderRepository.getStatisticalYear();
            statisticalOrdersDetailDTO = orderDetailRepository.getStatisticalYear();
        }
        if (type.equals("FT")) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime dateFrom = LocalDateTime.parse(fromDate, formatter);
            LocalDateTime dateTo = LocalDateTime.parse(toDate, formatter);

            statisticalOrdersDTOS = orderRepository.getStatisticalFromTo(dateFrom, dateTo);
            statisticalOrdersDetailDTO = orderDetailRepository.getStatisticalFromTo(dateFrom, dateTo);
        }
        Map<Integer, Integer> resultMap = statisticalOrdersDTOS.stream().collect(Collectors.toMap(StatisticalOrdersDTO::getStatus, StatisticalOrdersDTO::getTotalCount));

        statisticalDTO.setTotalRevenue(statisticalOrdersDetailDTO.getTotalRevenue());
        statisticalDTO.setTotalQuantity(statisticalOrdersDetailDTO.getTotalQuantity());
        statisticalDTO.setTotalSuccess(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_SUCCESS.getValue(), 0));
        statisticalDTO.setTotalFail(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_FAIL.getValue(), 0));
        statisticalDTO.setTotalCancel(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL.getValue(), 0));
        statisticalDTO.setTotalWaiting(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_WAITING_ACCEPT.getValue(), 0));
        statisticalDTO.setTotalAccept(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue(), 0));
        statisticalDTO.setTotalDelivery(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_DELIVERY.getValue(), 0));
        statisticalDTO.setTotalFinishDelivery(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY.getValue(), 0));


//    ORDER_STATUS_WAITING_ACCEPT(1, "Chờ xác nhận"),
//    ORDER_STATUS_ACCEPT(2, "Đã xác nhận"),
//    ORDER_STATUS_DELIVERY(3, "Chờ vận chuyển"),
//    ORDER_STATUS_FINISH_DELIVERY(4, "Đang vận chuyển"),
//    ORDER_STATUS_SUCCESS(5, "Hoàn thành"),
//    ORDER_STATUS_FAIL(8, "Tạo đơn thất bại"),
//    ORDER_STATUS_CUSTOMER_CANCEL(6, "Hủy đơn"),
//    ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE(7, "Không nhận hàng"),
        return statisticalDTO;
    }
}
