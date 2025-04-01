package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import org.springframework.data.domain.Pageable;

import java.sql.Date;
import java.util.List;

public interface IDiscountService {
    BaseResponseModel<DiscountModel> addOrChange(DiscountModel discountModel);
    BaseResponseModel<DiscountModel> getDiscountById(Integer id);
    BaseResponseModel<Integer> delete(Integer id, Integer status);
    BaseListResponseModel<List<DiscountModel>> getListDiscount(Date startDate, Date endDate, Integer minValue, Integer maxValue, String keySearch, Integer status, Pageable pageable);
    BaseResponseModel<String> generateDiscountCode();
}
