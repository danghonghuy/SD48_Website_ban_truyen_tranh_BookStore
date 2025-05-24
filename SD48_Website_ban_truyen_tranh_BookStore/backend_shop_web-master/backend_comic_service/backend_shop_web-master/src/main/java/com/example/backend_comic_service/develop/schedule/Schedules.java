package com.example.backend_comic_service.develop.schedule;

import com.example.backend_comic_service.develop.repository.OrderRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import static com.example.backend_comic_service.develop.enums.OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL;
import static com.example.backend_comic_service.develop.enums.OrderStatusEnum.ORDER_STATUS_WAITING_ACCEPT;

@Slf4j
@Component
@AllArgsConstructor
public class Schedules {
    private final OrderRepository orderRepository;

    @Scheduled(cron = "0 59 23 * * ?")
    public void resetOrderInCounterOutDate() {
        try {
            log.info("--- Staring resetOrderInCounterOutDate ---");
            orderRepository.resetOrderInCounterOutDate(ORDER_STATUS_CUSTOMER_CANCEL.getValue(), ORDER_STATUS_WAITING_ACCEPT.getValue(), 1);
            log.info("--- End resetOrderInCounterOutDate ---");
        } catch (Exception e) {
            log.error("--- resetOrderInCounterOutDate error: " + e.getMessage() + " ---");
        }
    }
}
