package com.example.backend_comic_service.develop.schedule;

import com.example.backend_comic_service.develop.constants.CouponStatusEnum;
import com.example.backend_comic_service.develop.repository.CouponRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CouponSchedule {
    private final CouponRepository couponRepository;
    @Autowired
    public CouponSchedule(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }
    @Scheduled(cron = "0 59 23 * * ?")
    public void resetCouponOutDate(){
        try{
            System.out.println("--- Staring schedule ---");
            couponRepository.resetCouponProgram(CouponStatusEnum.COUPON_STATUS_EXPIRE);
            System.out.println("--- End schedule ---");
        }
        catch (Exception e){
            log.error(e.getMessage());
            System.out.println("--- Schedule ending with fail error: " + e.getMessage() + " ---");
        }
    }
}
