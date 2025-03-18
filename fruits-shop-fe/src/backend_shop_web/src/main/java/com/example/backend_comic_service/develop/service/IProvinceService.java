package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.ProvinceModel;

import java.util.List;

public interface IProvinceService {
    BaseListResponseModel<List<ProvinceModel>> getListProvinces(String name);
}
