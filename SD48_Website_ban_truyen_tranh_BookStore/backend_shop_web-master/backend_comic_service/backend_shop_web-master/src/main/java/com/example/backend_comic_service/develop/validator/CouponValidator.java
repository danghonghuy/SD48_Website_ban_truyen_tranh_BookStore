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
        if (model == null) {
            return "Phiếu giảm giá không hợp lệ";
        }
        if (model.getCode().isEmpty()) {
            return "Mã phiếu giảm giá không được để trống";
        }
        if (model.getName().isEmpty()) {
            return "Tên phiếu giảm giá không được để trống";
        }
        if (model.getDateStart() == null || model.getDateEnd() == null) {
            return "Ngày bắt đầu hoặc ngày kết thúc của phiếu giảm giá không được để trống";
        }
        if (model.getPercentValue() == null || model.getMaxValue() == null) {
            return "Giá trị tối thiểu hoặc tối đa của phiếu giảm giá không được để trống";
        }

        if (model.getDateStart().compareTo(model.getDateEnd()) > 0) {
            return "Ngày bắt đầu của phiếu giảm giá phải nhỏ hơn hoặc bằng ngày kết thúc";
        }
        if (model.getId() == null || model.getId() == 0) {
            CouponEntity couponEntity = couponRepository.findByCode(model.getCode()).orElse(null);
            if (couponEntity != null) {
                return "Mã phiếu giảm giá đã tồn tại";
            }
        }
        return "";
    }

}
