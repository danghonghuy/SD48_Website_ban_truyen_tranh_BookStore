package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CategoryModel;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ICategoryService {

    BaseListResponseModel<List<CategoryModel>> getListCategory(String name, String code, Integer status, Pageable pageable);

    BaseResponseModel<Integer> addOrChange(CategoryModel categoryModel);
    BaseResponseModel<Integer> deleteCategory(Integer id);
    BaseResponseModel<CategoryModel> getCategoryDetail(Integer id);
    BaseResponseModel<String> generateCode();
}
