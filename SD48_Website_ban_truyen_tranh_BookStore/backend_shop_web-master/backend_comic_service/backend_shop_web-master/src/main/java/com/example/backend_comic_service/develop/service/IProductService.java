package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.excel.ExcelImportResult;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.model.request.product.ProductRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

public interface IProductService {
    BaseResponseModel<ProductModel> addOrChangeProduct(ProductRequest productModel, List<MultipartFile> images);
    BaseResponseModel<Integer> deleteProduct(Integer id, Integer status);
    BaseResponseModel<ProductModel> getProductById(Integer id);
    BaseListResponseModel<ProductModel> getListProduct( // Sửa ở đây
                                                        Integer categoryId, Integer typeId, String keySearch,
                                                        Integer status, Float minPrice, Float maxPrice, Pageable pageable
    );
    BaseResponseModel<String> generateCode(Integer idx);
    BaseResponseModel<List<ProductModel>> getSellingBest(); // Giữ nguyên nếu đây là danh sách không phân trang
    BaseResponseModel<List<ProductModel>> getRunningOut();  // Giữ nguyên nếu đây là danh sách không phân trang
    double getEffectivePrice(Integer productId, LocalDateTime calculationTime);
    ExcelImportResult readExcelWithImages(MultipartFile file) throws IOException; // Giữ nguyên kiểu trả về này

    byte[] exportProductsToExcel(
            String keySearch,
            Integer categoryId,
            Float minPrice,
            Float maxPrice,
            Integer typeId,
            Integer status
    ) throws IOException;
}