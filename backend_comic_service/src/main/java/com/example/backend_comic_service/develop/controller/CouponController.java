package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CouponModel;
import com.example.backend_comic_service.develop.service.ICouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/coupon")
public class CouponController {

    @Autowired
    private ICouponService couponService;

    @PostMapping("/add-or-change")
    public BaseResponseModel<CouponModel> addOrChange(@RequestBody CouponModel model) {
        return couponService.addOrChange(model);
    }
    @DeleteMapping("/delete/{id}")
    public BaseResponseModel<Integer> delete(@PathVariable Integer id) {
        return couponService.delete(id);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<CouponModel> detail(@PathVariable Integer id) {
        return couponService.getCouponById(id);
    }
    @GetMapping("/get-list-coupon")
    public BaseListResponseModel<List<CouponModel>> getListDiscount(@RequestParam(value = "startDate", required = false) Date startDate,
                                                                      @RequestParam(value = "endDate", required = false)Date endDate,
                                                                      @RequestParam(value = "minValue", required = false) Integer minValue,
                                                                      @RequestParam(value = "maxValue", required = false) Integer maxValue,
                                                                      @RequestParam(value = "keySearch", required = false) String keySearch,
                                                                      @RequestParam(value = "status", required = false) Integer status,
                                                                      @RequestParam(value = "pageIndex") Integer pageIndex,
                                                                      @RequestParam(value = "pageSize") Integer pageSize) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        return couponService.getListCoupon(startDate, endDate, minValue, maxValue, keySearch, status, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return couponService.generateCouponCode();
    }
}
