package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.model.request.DiscountRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime; // Sử dụng LocalDateTime thay vì java.sql.Date nếu CSDL và Entity dùng LocalDateTime

public interface IDiscountService {
    BaseResponseModel<DiscountModel> addOrChange(DiscountRequest discountModel);

    BaseResponseModel<DiscountModel> getDiscountById(Integer id);

    BaseResponseModel<Integer> delete(Integer id, Integer status);

    BaseListResponseModel<DiscountModel> getListDiscount( // Sửa ở đây
                                                          LocalDateTime startDate, LocalDateTime endDate,
                                                          Integer minValue, Integer maxValue,
                                                          String keySearch, Integer status,
                                                          Pageable pageable
    );

    BaseResponseModel<String> generateDiscountCode();
}