package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.DistrictModel; // Đảm bảo import đúng

// import java.util.List; // Không cần List ở đây cho kiểu trả về của getListDistrict

public interface IDistrictService {

    // SỬA Ở ĐÂY: Kiểu generic của BaseListResponseModel là DistrictModel
    BaseListResponseModel<DistrictModel> getListDistrict(String name, String provinceCode);

}