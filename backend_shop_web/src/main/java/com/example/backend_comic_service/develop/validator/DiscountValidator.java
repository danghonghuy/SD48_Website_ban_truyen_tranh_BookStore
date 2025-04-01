package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.DiscountEntity;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.repository.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DiscountValidator {
    @Autowired
    private DiscountRepository discountRepository;

    public String validator(DiscountModel model){
        if(model == null){
            return "Object model invalid";
        }
        if(model.getCode().isEmpty()){
            return "Discount model code is null or empty";
        }
        if(model.getName().isEmpty()){
            return "Discount model name is null or empty";
        }
        if(model.getStartDate() == null || model.getEndDate() == null){
            return "Discount model start date or end date is null or empty";
        }
        if(model.getStartDate().after(model.getEndDate())){
            return "Discount model start date must be smaller or equal to endDate";
        }
        if(model.getId() == null || model.getId() == 0){
            DiscountEntity discountEntity = discountRepository.findByCode(model.getCode()).orElse(null);
            if(discountEntity != null){
                return "Discount model code is duplicated";
            }
        }
        return "";
    }

}
