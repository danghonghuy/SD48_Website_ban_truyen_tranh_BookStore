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
    @GetMapping("/delete")
    public BaseResponseModel<Integer> changeStatus(@RequestParam(value = "id", required = false)  Integer id,
                                                   @RequestParam(value = "status", required = false)  Integer status) {
        return couponService.delete(id,status);
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
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize);
        return couponService.getListCoupon(startDate, endDate, minValue, maxValue, keySearch, status, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return couponService.generateCouponCode();
    }
    @GetMapping("/get-coupon-code")
    public BaseResponseModel<Double> getCoupon(@RequestParam(value = "code", required = false) String code,
                                               @RequestParam(value = "sumPrice", required = false) Double sumPrice) {
        return couponService.useCoupon(code, sumPrice);
    }
}
