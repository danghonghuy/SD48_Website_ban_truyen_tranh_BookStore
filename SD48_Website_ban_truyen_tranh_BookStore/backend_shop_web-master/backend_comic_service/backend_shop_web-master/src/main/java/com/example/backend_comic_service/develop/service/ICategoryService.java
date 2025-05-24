package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CategoryModel; // Đảm bảo import đúng
import org.springframework.data.domain.Pageable;

// import java.util.List; // Không cần List ở đây cho kiểu trả về của getListCategory

public interface ICategoryService {

    // SỬA Ở ĐÂY: Kiểu generic của BaseListResponseModel là CategoryModel
    BaseListResponseModel<CategoryModel> getListCategory(String keySearch, Integer status, Pageable pageable);

    BaseResponseModel<Integer> addOrChange(CategoryModel categoryModel);
    BaseResponseModel<Integer> deleteCategory(Integer id, Integer status);
    BaseResponseModel<CategoryModel> getCategoryDetail(Integer id); // Đổi tên từ getById cho rõ nghĩa hơn
    BaseResponseModel<String> generateCode();
}