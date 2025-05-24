package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.model.model.OrderModel;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class OrderValidator {

    public String validate(OrderModel order) {
        if(order == null){
            return "Đơn hàng không hợp lệ";
        }
//        if(Optional.ofNullable(order.getUserId()).orElse(0) == 0 && order.getUserType() == 2){
//            return "User is null";
//        }
        if(Optional.ofNullable(order.getPaymentId()).orElse(0) == 0){
            return "Phương thức thanh toán trống";
        }
//        if(Optional.ofNullable(order.getAddressId()).orElse(0) == 0 && order.getUserType() == 2){
//            return "Address is null";
//        }
        if(Optional.ofNullable(order.getDeliveryType()).orElse(0) == 0){
            return "Vận chuyển trống";
        }
        return "";
    }

}
