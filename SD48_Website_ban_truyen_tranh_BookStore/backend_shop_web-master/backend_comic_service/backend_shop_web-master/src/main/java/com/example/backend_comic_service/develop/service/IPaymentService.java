package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.PaymentModel;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
// import java.util.List; // Không cần cho getAllPayments nếu đã sửa

public interface IPaymentService {
    BaseResponseModel<PaymentModel> addOrChange(PaymentModel paymentModel);
    BaseResponseModel<PaymentModel> getPaymentById(Integer id);
    BaseListResponseModel<PaymentModel> getAllPayments(String keySearch, Integer status, Pageable pageable); // Sửa ở đây
    BaseResponseModel<Integer> delete(Integer id, Integer status);
    BaseResponseModel<String> generateCode();
    BaseResponseModel<String> payWithMomo(String orderId, BigDecimal amount);
}