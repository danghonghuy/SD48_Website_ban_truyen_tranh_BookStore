package com.example.backend_comic_service.develop.schedule;

import com.example.backend_comic_service.develop.constants.CouponStatusEnum;
import com.example.backend_comic_service.develop.constants.DiscountStatusEnum;
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
    @Scheduled(cron = "0 0 0 * * ?")
    public void resetCouponOutDate(){
        try{
            log.info("--- Staring resetCouponOutDate ---");
            couponRepository.resetCouponProgram(CouponStatusEnum.COUPON_STATUS_EXPIRED);
            couponRepository.imminentCouponProgram(CouponStatusEnum.COUPON_STATUS_IMMINENT);
            couponRepository.activeCouponProgram(CouponStatusEnum.COUPON_STATUS_ACTIVE);
            log.info("--- End resetCouponOutDate ---");
        }
        catch (Exception e){
            log.error("--- Schedule resetCouponOutDate error: " + e.getMessage() + " ---");
        }
    }
}
