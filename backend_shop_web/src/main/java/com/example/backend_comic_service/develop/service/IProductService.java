package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IProductService {
    BaseResponseModel<ProductModel> addOrChangeProduct(ProductModel productModel);
    BaseResponseModel<Integer> deleteProduct(Integer id);
    BaseResponseModel<ProductModel> getProductById(Integer id);
    BaseListResponseModel<List<ProductModel>> getListProduct(Integer categoryId, Integer typeId, String keySearch, Pageable pageable);
    BaseResponseModel<String> generateCode();
}
