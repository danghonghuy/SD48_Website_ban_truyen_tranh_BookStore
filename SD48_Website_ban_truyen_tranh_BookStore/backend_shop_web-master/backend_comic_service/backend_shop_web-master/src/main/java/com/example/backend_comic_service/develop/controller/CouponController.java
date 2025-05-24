package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CouponModel;
import com.example.backend_comic_service.develop.model.model.CouponRequest;
import com.example.backend_comic_service.develop.service.ICouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/coupon")
public class CouponController {

    @Autowired
    private ICouponService couponService;

    @PostMapping("/add-or-change")
    public BaseResponseModel<CouponModel> addOrChange(@RequestBody CouponRequest request) {
        return couponService.addOrChange(request);
    }

    @GetMapping("/delete")
    public BaseResponseModel<Integer> changeStatus(@RequestParam(value = "id", required = false) Integer id,
                                                   @RequestParam(value = "status", required = false) Integer status) {
        return couponService.delete(id, status);
    }

    @GetMapping("/detail/{id}")
    public BaseResponseModel<CouponModel> detail(@PathVariable Integer id) {
        return couponService.getCouponById(id);
    }

    @GetMapping("{code}/detail")
    public BaseResponseModel<CouponModel> detail(@PathVariable String code) {
        return couponService.getCouponByCode(code);
    }

    @GetMapping("/get-list-coupon")
    public BaseListResponseModel<CouponModel> getListDiscount( // Sửa ở đây
                                                               @RequestParam(value = "startDate", required = false) LocalDateTime startDate,
                                                               @RequestParam(value = "endDate", required = false) LocalDateTime endDate,
                                                               @RequestParam(value = "minValue", required = false) Integer minValue,
                                                               @RequestParam(value = "maxValue", required = false) Integer maxValue,
                                                               @RequestParam(value = "keySearch", required = false) String keySearch,
                                                               @RequestParam(value = "status", required = false) Integer status,
                                                               @RequestParam(value = "pageIndex", defaultValue = "1") Integer pageIndex, // Thêm defaultValue và giả sử 1-based
                                                               @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) { // Thêm defaultValue
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize, Sort.by("id").descending()); // Giả sử sort by id và pageIndex là 1-based
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
