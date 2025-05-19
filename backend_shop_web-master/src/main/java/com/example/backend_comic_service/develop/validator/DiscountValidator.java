package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.DiscountEntity;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.model.request.DiscountRequest;
import com.example.backend_comic_service.develop.repository.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DiscountValidator {
    @Autowired
    private DiscountRepository discountRepository;

    public String validator(DiscountRequest model){
        if(model == null){
            return "Đợt giảm giá không hợp lệ";
        }
        if(model.getCode().isEmpty()){
            return "Mã đợt giảm giá không được để trống";
        }
        if(model.getName().isEmpty()){
            return "Tên đợt giảm giá không được để trống";
        }
        if(model.getStartDate() == null || model.getEndDate() == null){
            return "Ngày bắt đầu hoặc ngày kết thúc không được để trống";
        }
        if(model.getStartDate().isAfter(model.getEndDate())){
            return "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc";
        }
        if(model.getId() == null || model.getId() == 0){
            DiscountEntity discountEntity = discountRepository.findByCode(model.getCode()).orElse(null);
            if(discountEntity != null){
                return "Đợt giảm giá đã tồn tại";
            }
        }
        return "";
    }

}
