package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.CatalogModel;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CategoryModel;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ICatalogService {
    BaseListResponseModel<List<CatalogModel>> getList(String keySearch, Integer status, Pageable pageable);
    BaseResponseModel<Integer> addOrChange(CatalogModel categoryModel);
    BaseResponseModel<Integer> deleteCategory(Integer id, Integer status);
    BaseResponseModel<CatalogModel> getById(Integer id);
    BaseResponseModel<String> generateCode();
}
