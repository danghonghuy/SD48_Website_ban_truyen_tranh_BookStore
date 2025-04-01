package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.model.model.TypeModel;
import org.springframework.data.domain.Pageable;

import java.sql.Date;
import java.util.List;

public interface ITypeService {
    BaseResponseModel<TypeModel> addOrChange(TypeModel discountModel);
    BaseResponseModel<TypeModel> getTypeById(Integer id);
    BaseResponseModel<Integer> delete(Integer id, Integer status);
    BaseListResponseModel<List<TypeModel>> getListTypes(String keySearch, Integer status, Pageable pageable);
    BaseResponseModel<String> generaTypeCode();
}
