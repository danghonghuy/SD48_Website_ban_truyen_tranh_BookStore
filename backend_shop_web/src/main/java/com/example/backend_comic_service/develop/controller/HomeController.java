package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.model.dto.StatisticalDTO;
import com.example.backend_comic_service.develop.model.dto.StatisticalOrdersDTO;
import com.example.backend_comic_service.develop.model.dto.StatisticalOrdersDetailDTO;
import com.example.backend_comic_service.develop.repository.OrderDetailRepository;
import com.example.backend_comic_service.develop.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/home")
public class HomeController {
    @RequestMapping(value = "/index", method = RequestMethod.POST)
    public String Home(){
        return "Hello World";
    }

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderDetailRepository orderDetailRepository;

    @GetMapping(value = "/{type}/statistical")
    public StatisticalDTO statistical(@PathVariable String type) {
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
        Map<Integer, Integer> resultMap = statisticalOrdersDTOS.stream().collect(Collectors.toMap(
                StatisticalOrdersDTO::getStatus, StatisticalOrdersDTO::getTotalCount));

        statisticalDTO.setTotalRevenue(statisticalOrdersDetailDTO.getTotalRevenue());
        statisticalDTO.setTotalQuantity(statisticalOrdersDetailDTO.getTotalQuantity());
        statisticalDTO.setTotalSuccess(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_SUCCESS.getValue(), 0));
        statisticalDTO.setTotalFail(resultMap.getOrDefault(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL.getValue(), 0));
        return statisticalDTO;
    }
}
