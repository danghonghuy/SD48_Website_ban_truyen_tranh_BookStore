package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.WardEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.WardModel;
import com.example.backend_comic_service.develop.repository.WardRepository;
import com.example.backend_comic_service.develop.service.IWardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class WardServiceImpl implements IWardService {
    @Autowired
    private WardRepository wardRepository;

    @Override
    public BaseListResponseModel<List<WardModel>> getListWards(String name, String districtCode) {
        BaseListResponseModel<List<WardModel>> response = new BaseListResponseModel<>();
        try{
            List<WardEntity> wardEntities = wardRepository.getListWards(name, districtCode);
            if(wardEntities.isEmpty()){
                response.successResponse(null, "List wards is empty");
                return response;
            }
            List<WardModel> wardModels = wardEntities.stream().map(WardEntity::toWardModel).toList();
            response.successResponse(wardModels, "List wards is " + wardModels.size());
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
