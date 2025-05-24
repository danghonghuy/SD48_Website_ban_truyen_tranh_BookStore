package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.PaymentEntity;
import com.example.backend_comic_service.develop.model.model.PaymentModel;
import com.example.backend_comic_service.develop.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Objects;
import java.util.Optional;

@Component
public class PaymentValidator {

    @Autowired
    private PaymentRepository paymentRepository;

    public String validate(PaymentModel model){
        if(model == null){
            return "Phương thức thanh toán trống";
        }
        if(!StringUtils.hasText(model.getCode()) && (model.getId() == null || model.getId() == 0)){
            return "Mã phương thức thanh toán không hợp lệ";
        }
        if(!StringUtils.hasText(model.getName())){
            return "Tên phương thức thanh toán không hợp lệ";
        }
        if(Optional.ofNullable(model.getId()).orElse(0) > 0){
            PaymentEntity paymentEntity = paymentRepository.findById(model.getId()).orElse(null);
            if(paymentEntity != null && !Objects.equals(model.getId(), paymentEntity.getId())){
                return "Mã phương thức thanh toán đã tồn tại";
            }
        }
        return "";
    }

}
