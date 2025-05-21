package com.example.backend_comic_service;

import com.example.backend_comic_service.develop.schedule.CouponSchedule;
import com.example.backend_comic_service.develop.schedule.DiscountSchedule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendComicServiceApplicationTests {

	@Autowired
	CouponSchedule resetDiscountSchedule;	@Test
	void contextLoads() {
		resetDiscountSchedule.resetCouponOutDate();
	}

}
