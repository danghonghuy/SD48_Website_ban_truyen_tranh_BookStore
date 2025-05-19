package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.model.request.product.ProductRequest;
import com.example.backend_comic_service.develop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class ProductValidator {

    @Autowired
    private ProductRepository productRepository;

    public String validate(ProductRequest productModel) {

        if(productModel == null){
            return "Sản phẩm không tồn tại";
        }
        if(!StringUtils.hasText(productModel.getName())){
            return "Tên sản phẩm không được để trống";
        }
        if(!StringUtils.hasText(productModel.getCode()) && productModel.getId() == null){
            return "Mã sản phẩm không được để trống";
        }
        if(productModel.getTypeId() == null){
            return "Gói bán sản phẩm không hợp lệ";
        }
        if(productModel.getCategoryId() == null){
            return "Thể loại sản phẩm không hợp lệ";
        }
        if(productModel.getPrice() == 0){
            return "Giá sản phẩm phải lớn hơn 0\n";
        }
        if(productModel.getStock() == null || productModel.getStock() <= 0){
            return "Số lượng sản phẩm không để trống và lớn hơn 0";
        }
        if(productModel.getId() != null){
            ProductEntity productEntity = productRepository.findByCode(productModel.getCode()).orElse(null);
            if(productEntity != null && !productEntity.getId().equals(productModel.getId())){
                return "Mã sản phẩm đã tồn tại";
            }
        }
        return "";
    }
}
