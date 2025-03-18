package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class ProductValidator {

    @Autowired
    private ProductRepository productRepository;

    public String validate(ProductModel productModel) {

        if(productModel == null){
            return "Product is null";
        }
        if(!StringUtils.hasText(productModel.getName())){
            return "Product name is empty";
        }
        if(!StringUtils.hasText(productModel.getCode()) && productModel.getId() == null){
            return "Product code is empty";
        }
        if(productModel.getTypeId() == null){
            return "Product's type is empty";
        }
        if(productModel.getCategoryId() == null){
            return "Product's category is empty";
        }
        if(productModel.getPrice() == 0){
            return "Product's price must be greater than zero";
        }
        if(productModel.getStock() == null || productModel.getStock() <= 0){
            return "Product's stock must be not null and greater than zero";
        }
        if(productModel.getId() != null){
            ProductEntity productEntity = productRepository.findByCode(productModel.getCode()).orElse(null);
            if(productEntity != null && !productEntity.getId().equals(productModel.getId())){
                return "Product code is exist";
            }
        }
        return "";
    }

}
