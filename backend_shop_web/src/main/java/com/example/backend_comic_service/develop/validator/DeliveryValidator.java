package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.DeliveryEntity;
import com.example.backend_comic_service.develop.model.model.DeliveryModel;
import com.example.backend_comic_service.develop.model.model.PaymentModel;
import com.example.backend_comic_service.develop.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Objects;
import java.util.Optional;

@Component
public class DeliveryValidator {

    @Autowired
    private DeliveryRepository deliveryRepository;

    public String validate(DeliveryModel model){
        if(model == null){
            return "Delivery is null";
        }
        if(!StringUtils.hasText(model.getCode()) && (model.getId() == null || model.getId() == 0)){
            return "Delivery code is invalid";
        }
        if(!StringUtils.hasText(model.getName())){
            return "Delivery name is invalid";
        }
        if(Optional.ofNullable(model.getId()).orElse(0) > 0){
            DeliveryEntity deliveryEntity = deliveryRepository.findById(model.getId()).orElse(null);
            if(deliveryEntity != null && !Objects.equals(model.getId(), deliveryEntity.getId())){
                return "Delivery code is exist";
            }
        }
        return "";
    }
}
