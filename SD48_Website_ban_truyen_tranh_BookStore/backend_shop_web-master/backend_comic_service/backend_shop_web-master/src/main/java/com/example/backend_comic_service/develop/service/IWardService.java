package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.WardModel;

// import java.util.List; // Không cần cho getListWards nếu đã sửa

public interface IWardService {
    BaseListResponseModel<WardModel> getListWards(String name, String districtCode); // Sửa ở đây
}