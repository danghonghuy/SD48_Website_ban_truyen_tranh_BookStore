package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CouponModel;
import org.springframework.data.domain.Pageable;

import java.sql.Date;
import java.util.List;

public interface ICouponService {

    BaseResponseModel<CouponModel> addOrChange(CouponModel discountModel);
    BaseResponseModel<CouponModel> getCouponById(Integer id);
    BaseResponseModel<Integer> delete(Integer id, Integer status);
    BaseListResponseModel<List<CouponModel>> getListCoupon(Date startDate, Date endDate, Integer minValue, Integer maxValue, String keySearch, Integer status, Pageable pageable);
    BaseResponseModel<String> generateCouponCode();
    BaseResponseModel<Double> useCoupon(String couponCode, Double sumPrice);
}
