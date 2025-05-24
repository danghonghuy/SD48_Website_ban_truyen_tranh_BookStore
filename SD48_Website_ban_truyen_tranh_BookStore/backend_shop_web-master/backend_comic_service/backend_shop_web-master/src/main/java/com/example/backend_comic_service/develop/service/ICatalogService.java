package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.CatalogModel; // Đảm bảo import đúng CatalogModel
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
// import com.example.backend_comic_service.develop.model.model.CategoryModel; // Có vẻ không dùng ở đây
import org.springframework.data.domain.Pageable;

// import java.util.List; // Không cần List ở đây cho kiểu trả về của getList

public interface ICatalogService {

    // SỬA Ở ĐÂY: Kiểu generic của BaseListResponseModel là CatalogModel
    BaseListResponseModel<CatalogModel> getList(String keySearch, Integer status, Pageable pageable);

    BaseResponseModel<Integer> addOrChange(CatalogModel catalogModel); // Sửa CategoryModel thành CatalogModel nếu đúng
    BaseResponseModel<Integer> deleteCategory(Integer id, Integer status); // Tên hàm có vẻ liên quan Category?
    BaseResponseModel<CatalogModel> getById(Integer id);
    BaseResponseModel<String> generateCode();
}