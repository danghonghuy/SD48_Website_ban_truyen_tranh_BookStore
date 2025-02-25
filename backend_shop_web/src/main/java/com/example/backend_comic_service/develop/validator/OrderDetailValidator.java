package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.model.model.OrderDetailModel;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class OrderDetailValidator {
    public String validate(OrderDetailModel model){
        if(model == null){
            return "Order detail is invalid";
        }
//        if(Optional.ofNullable(model.getOrderId()).orElse(0) == 0){
//            return "Order Id is invalid";
//        }
        if(Optional.ofNullable(model.getProductId()).orElse(0) == 0){
            return "Product Id is invalid";
        }
        return "";
    }
}
