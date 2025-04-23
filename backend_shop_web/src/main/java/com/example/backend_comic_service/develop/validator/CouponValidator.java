package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.CouponEntity;
import com.example.backend_comic_service.develop.model.model.CouponModel;
import com.example.backend_comic_service.develop.model.model.CouponRequest;
import com.example.backend_comic_service.develop.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CouponValidator {

    @Autowired
    private CouponRepository couponRepository;

    public String validate(CouponRequest model) {
        if(model == null){
            return "Object model invalid";
        }
        if(model.getCode().isEmpty()){
            return "Coupon model code is null or empty";
        }
        if(model.getName().isEmpty()){
            return "Coupon model name is null or empty";
        }
        if(model.getDateStart() == null || model.getDateEnd() == null){
            return "Coupon model start date or end date is null or empty";
        }
        if(model.getMinValue() == null || model.getMaxValue() == null){
            return "Coupon model minValue or maxValue is null or empty";
        }
        if(model.getMinValue() > model.getMaxValue()){
            return "Coupon model minValue must be smaller maxValue";
        }
        if(model.getDateStart().compareTo(model.getDateEnd()) > 0){
            return "Coupon model start date must be smaller or equal to endDate";
        }
        if(model.getId() == null || model.getId() == 0){
            CouponEntity couponEntity = couponRepository.findByCode(model.getCode()).orElse(null);
            if(couponEntity != null){
                return "Coupon model code is duplicated";
            }
        }
        return "";
    }

}
