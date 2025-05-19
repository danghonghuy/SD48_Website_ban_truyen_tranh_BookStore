package com.example.backend_comic_service.develop.schedule;

import com.example.backend_comic_service.develop.constants.DiscountStatusEnum;
import com.example.backend_comic_service.develop.repository.DiscountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DiscountSchedule {

    private final DiscountRepository discountRepository;

    @Autowired
    public DiscountSchedule(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void resetDiscountSchedule() {
        try {
            log.info("--- Staring resetDiscountSchedule ---");
            discountRepository.resetDiscountProgram(DiscountStatusEnum.DISCOUNT_STATUS_EXPIRED);
            discountRepository.imminentDiscountProgram(DiscountStatusEnum.DISCOUNT_STATUS_IMMINENT);
            discountRepository.activeDiscountProgram(DiscountStatusEnum.DISCOUNT_STATUS_ACTIVE);
            log.info("--- End resetDiscountSchedule ---");
        } catch (Exception e) {
            log.error("--- resetDiscountSchedule fail error: " + e.getMessage() + " ---");
        }
    }
}
