package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
// import com.example.backend_comic_service.develop.model.model.DiscountModel; // Có vẻ không dùng ở đây
import com.example.backend_comic_service.develop.model.model.TypeModel;
import org.springframework.data.domain.Pageable;

// import java.sql.Date; // Có vẻ không dùng ở đây
// import java.util.List; // Không cần cho getListTypes nếu đã sửa

public interface ITypeService {
    BaseResponseModel<TypeModel> addOrChange(TypeModel typeModel); // Đổi tên tham số cho nhất quán
    BaseResponseModel<TypeModel> getTypeById(Integer id);
    BaseResponseModel<Integer> delete(Integer id, Integer status);
    BaseListResponseModel<TypeModel> getListTypes(String keySearch, Integer status, Pageable pageable); // Sửa ở đây
    BaseResponseModel<String> generaTypeCode(); // Sửa tên phương thức: generateTypeCode
}