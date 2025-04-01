package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import jakarta.mail.Multipart;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IProductService {
    BaseResponseModel<ProductModel> addOrChangeProduct(ProductModel productModel, List<MultipartFile> images);
    BaseResponseModel<Integer> deleteProduct(Integer id, Integer status);
    BaseResponseModel<ProductModel> getProductById(Integer id);
    BaseListResponseModel<List<ProductModel>> getListProduct(Integer categoryId, Integer typeId, String keySearch, Integer status, Pageable pageable);
    BaseResponseModel<String> generateCode();
}
