package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.model.model.OrderModel;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class OrderValidator {

    public String validate(OrderModel order) {
        if(order == null){
            return "Order is null";
        }
        if(Optional.ofNullable(order.getUserId()).orElse(0) == 0){
            return "User is null";
        }
        if(Optional.ofNullable(order.getPaymentId()).orElse(0) == 0){
            return "Payment method is null";
        }
        if(Optional.ofNullable(order.getEmployeeId()).orElse(0) == 0){
            return "Employee is null";
        }
        if(Optional.ofNullable(order.getAddressId()).orElse(0) == 0){
            return "Address is null";
        }
        if(Optional.ofNullable(order.getDeliveryType()).orElse(0) == 0){
            return "Delivery type is null";
        }
        return "";
    }

}
