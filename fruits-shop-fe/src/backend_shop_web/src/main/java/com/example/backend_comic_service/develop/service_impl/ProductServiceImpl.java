package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.CategoryEntity;
import com.example.backend_comic_service.develop.entity.DiscountEntity;
import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.entity.TypeEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.repository.CategoryRepository;
import com.example.backend_comic_service.develop.repository.ProductRepository;
import com.example.backend_comic_service.develop.repository.TypeRepository;
import com.example.backend_comic_service.develop.service.IProductService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.ProductValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class ProductServiceImpl implements IProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UtilService utilService;
    @Autowired
    private ProductValidator productValidator;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private TypeRepository typeRepository;

    @Override
    public BaseResponseModel<ProductModel> addOrChangeProduct(ProductModel productModel) {
        BaseResponseModel<ProductModel> response = new BaseResponseModel<>();
        try{
            String errorMessage = productValidator.validate(productModel);
            if(StringUtils.hasText(errorMessage)){
                response.errorResponse(errorMessage);
                return response;
            }
            ProductEntity entity = productModel.toEntity();
            TypeEntity typeEntity = typeRepository.findById(productModel.getTypeId()).orElse(null);
            if(typeEntity == null){
                response.errorResponse("Type entity not exist");
                return response;
            }
            CategoryEntity categoryEntity = categoryRepository.findById(productModel.getCategoryId()).orElse(null);
            if(categoryEntity == null){
                response.errorResponse("Category entity not exist");
                return response;
            }
            entity.setTypeEntity(typeEntity);
            entity.setCategoryEntity(categoryEntity);
            ProductEntity productEntity = productRepository.saveAndFlush(entity);
            if(productEntity.getId() != null){
                response.successResponse(productModel, "Update successful");
                return response;
            }
            response.errorResponse("Add or change product failed");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> deleteProduct(Integer id) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            ProductEntity productEntity = productRepository.findById(id).orElse(null);
            if(productEntity == null){
                response.errorResponse("Product not found");
                return response;
            }
            productRepository.delete(productEntity);
            response.successResponse(id, "Delete Product success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<ProductModel> getProductById(Integer id) {
        BaseResponseModel<ProductModel> response = new BaseResponseModel<>();
        try{
            ProductEntity productEntity = productRepository.findById(id).orElse(null);
            if(productEntity == null){
                response.errorResponse("Product not found");
                return response;
            }
            ProductModel productModel = productEntity.toProductModel();
            response.successResponse(productModel, "Success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<List<ProductModel>> getListProduct(Integer categoryId, Integer typeId, String keySearch, Pageable pageable) {
        BaseListResponseModel<List<ProductModel>> response = new BaseListResponseModel<>();
        try{
            Page<ProductEntity> entityList = productRepository.getListProduct(keySearch, categoryId, typeId, pageable);
            if(entityList == null){
                response.errorResponse("Product list is empty");
                return response;
            }
            List<ProductModel> models = entityList.getContent().stream().map(ProductEntity::toProductModel).toList();
            response.successResponse(models, "Success");
            response.setTotalCount((int) entityList.getTotalElements());
            response.setPageSize(pageable.getPageSize());
            response.setPageIndex(pageable.getPageNumber());
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<String> generateCode() {
        BaseResponseModel<String> response  = new BaseResponseModel<>();
        try{
            Integer idLastest =  productRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("PRO", idLastest);
            response.successResponse(codeGender, "Generate product code success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
