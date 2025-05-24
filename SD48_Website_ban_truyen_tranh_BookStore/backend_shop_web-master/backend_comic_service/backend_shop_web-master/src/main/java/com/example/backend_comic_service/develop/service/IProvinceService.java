package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.ProvinceModel;

// import java.util.List; // Không cần cho getListProvinces nếu đã sửa

public interface IProvinceService {
    BaseListResponseModel<ProvinceModel> getListProvinces(String name); // Sửa ở đây
}