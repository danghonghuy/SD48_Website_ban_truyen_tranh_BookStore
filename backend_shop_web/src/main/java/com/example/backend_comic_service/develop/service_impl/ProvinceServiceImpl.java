package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.ProvincesEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.ProvinceModel;
import com.example.backend_comic_service.develop.repository.ProvinceRepository;
import com.example.backend_comic_service.develop.service.IProvinceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ProvinceServiceImpl implements IProvinceService {

    @Autowired
    private ProvinceRepository provinceRepository;

    @Override
    public BaseListResponseModel<List<ProvinceModel>> getListProvinces(String name) {
        BaseListResponseModel<List<ProvinceModel>> response = new BaseListResponseModel<>();
        try{
            List<ProvincesEntity> provincesEntities = provinceRepository.getListProvinces(name);
            if(provincesEntities.isEmpty()){
                response.successResponse(null, "List of provinces is empty");
                return response;
            }
            List<ProvinceModel> provinceModels = provincesEntities.stream().map(ProvincesEntity::toProvinceModel).toList();
            response.successResponse(provinceModels, "List of provinces is " + provinceModels.size());
            return response;
        }
        catch (Exception e){
            log.error(e.getMessage());
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
