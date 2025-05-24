package com.example.backend_comic_service.develop.service;

// import com.example.backend_comic_service.develop.entity.DeliveryEntity; // Không cần thiết ở interface
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DeliveryModel;
// import com.example.backend_comic_service.develop.model.model.PaymentModel; // Có vẻ không dùng ở đây
import org.springframework.data.domain.Pageable;

// import java.util.List; // Không cần cho getList nếu đã sửa

public interface IDeliveryService {
    BaseListResponseModel<DeliveryModel> getList(String keySearch, Integer status, Pageable pageable); // Sửa ở đây
    BaseResponseModel<DeliveryModel> addOrChange(DeliveryModel model);
    BaseResponseModel<DeliveryModel> getById(Integer id);
    BaseResponseModel<Integer> delete(Integer id, Integer status);
    BaseResponseModel<String> generateCode();
}