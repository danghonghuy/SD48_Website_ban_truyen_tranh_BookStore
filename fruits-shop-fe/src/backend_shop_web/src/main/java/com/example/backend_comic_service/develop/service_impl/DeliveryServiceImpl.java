package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.DeliveryEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.repository.DeliveryRepository;
import com.example.backend_comic_service.develop.service.IDeliveryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class DeliveryServiceImpl implements IDeliveryService {
    @Autowired
    private DeliveryRepository deliveryRepository;

    @Override
    public BaseListResponseModel<List<DeliveryEntity>> getList() {
        BaseListResponseModel<List<DeliveryEntity>> response = new BaseListResponseModel<>();
        try{
            List<DeliveryEntity> list = deliveryRepository.findAll();
            response.successResponse(list, "Success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
