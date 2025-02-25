package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.DistrictModel;

import java.util.List;

public interface IDistrictService {
    BaseListResponseModel<List<DistrictModel>> getListDistrict(String name, String provinceCode);
}
