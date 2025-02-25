package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.DistrictEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.DistrictModel;
import com.example.backend_comic_service.develop.repository.DistrictRepository;
import com.example.backend_comic_service.develop.service.IDistrictService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class DistrictServiceImpl implements IDistrictService {

    @Autowired
    private DistrictRepository districtRepository;

    @Override
    public BaseListResponseModel<List<DistrictModel>> getListDistrict(String name, String provinceCode) {
        BaseListResponseModel<List<DistrictModel>> response = new BaseListResponseModel<>();
        try{
            List<DistrictEntity> districtEntities = districtRepository.getListDistrict(name, provinceCode);
            if(districtEntities.isEmpty()){
                response.successResponse(null, "List district is empty");
                return response;
            }
            List<DistrictModel> districtModels = districtEntities.stream().map(DistrictEntity::todistrictModel).toList();
            response.successResponse(districtModels, "List district is success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
