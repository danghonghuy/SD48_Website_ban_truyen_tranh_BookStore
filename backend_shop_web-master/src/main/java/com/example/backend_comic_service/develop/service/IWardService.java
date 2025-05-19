package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.WardModel;

import java.util.List;

public interface IWardService {
    BaseListResponseModel<List<WardModel>> getListWards(String name, String districtCode);
}
