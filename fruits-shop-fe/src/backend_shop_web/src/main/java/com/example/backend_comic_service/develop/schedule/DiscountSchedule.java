package com.example.backend_comic_service.develop.schedule;

import com.example.backend_comic_service.develop.constants.DiscountStatusEnum;
import com.example.backend_comic_service.develop.constants.TypeDiscountEnum;
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

    @Scheduled(cron = "0 0 12 * * ?")
    public void resetDiscountSchedule(){
       try{
           System.out.println("--- Staring schedule ---");
           discountRepository.resetDiscountProgram(DiscountStatusEnum.DISCOUNT_STATUS_EXPIRED);
           System.out.println("--- End schedule ---");
       }
       catch (Exception e){
           log.error(e.getMessage());
           System.out.println("--- Schedule ending with fail error: " + e.getMessage() + " ---");
       }
    }
}
