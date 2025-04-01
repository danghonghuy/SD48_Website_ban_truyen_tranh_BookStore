package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.PaymentModel;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IPaymentService {
    BaseResponseModel<PaymentModel> addOrChange(PaymentModel paymentModel);
    BaseResponseModel<PaymentModel> getPaymentById(Integer id);
    BaseListResponseModel<List<PaymentModel>> getAllPayments(String keySearch, Integer status,  Pageable pageable);
    BaseResponseModel<Integer> delete(Integer id, Integer status);
    BaseResponseModel<String> generateCode();
}
