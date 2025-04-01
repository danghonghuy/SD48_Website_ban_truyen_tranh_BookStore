package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.*;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.repository.*;
import com.example.backend_comic_service.develop.service.IProductService;
import com.example.backend_comic_service.develop.utils.HandleImageService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.ProductValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;
    private final UtilService utilService;
    private final ProductValidator productValidator;
    private final CategoryRepository categoryRepository;
    private final TypeRepository typeRepository;
    private final UserRepository userRepository;
    private final HandleImageService handleImageService;
    private final ImageRepository imageRepository;
    @Autowired
    public ProductServiceImpl(ProductRepository productRepository,
                              UtilService utilService,
                              ProductValidator productValidator,
                              CategoryRepository categoryRepository,
                              TypeRepository typeRepository,
                              UserRepository userRepository,
                              HandleImageService handleImageService,
                              ImageRepository imageRepository) {
        this.productRepository = productRepository;
        this.utilService = utilService;
        this.productValidator = productValidator;
        this.categoryRepository = categoryRepository;
        this.typeRepository = typeRepository;
        this.userRepository = userRepository;
        this.handleImageService = handleImageService;
        this.imageRepository = imageRepository;
    }
    @Override
    public BaseResponseModel<ProductModel> addOrChangeProduct(ProductModel productModel, List<MultipartFile> images) {
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
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                UserEntity userCreate = userRepository.findUserEntitiesByUserName(username).orElse(null);
                if (userCreate == null) {
                    response.errorResponse("User token is invalid");
                    return response;
                }
                if(Optional.ofNullable(productModel.getId()).orElse(0) == 0){
                    entity.setCreatedBy(userCreate.getId());
                    entity.setCreatedDate(Date.valueOf(LocalDate.now()));
                }
                entity.setUpdatedBy(userCreate.getId());
                entity.setUpdatedDate(Date.valueOf(LocalDate.now()));
            } catch (Exception e) {
                log.error(e.getMessage());
                response.errorResponse(e.getMessage());
                return response;
            }
            entity.setTypeEntity(typeEntity);
            entity.setCategoryEntity(categoryEntity);
            ProductEntity productEntity = productRepository.saveAndFlush(entity);
            if(productEntity.getId() != null){
                if(!images.isEmpty()){
                    List<ImageEntity> imageEntities = new ArrayList<>();
                         images.forEach(model -> {
                         ImageEntity imageEntity = new ImageEntity();
                         String imageUrl = handleImageService.saveFileImage(model);
                         if(StringUtils.hasText(imageUrl)){
                             imageEntity.setImageUrl(imageUrl);
                             imageEntity.setStatus(1);
                             imageEntity.setIsDeleted(0);
                             imageEntity.setCreatedBy(productEntity.getCreatedBy());
                             imageEntity.setUpdateBy(productEntity.getUpdatedBy());
                             imageEntity.setCreatedDate(Date.valueOf(LocalDate.now()));
                             imageEntity.setUpdateDate(Date.valueOf(LocalDate.now()));
                             imageEntity.setProductEntity(productEntity);
                             imageEntities.add(imageEntity);
                         }
                     });
                     if(!imageEntities.isEmpty()){
                         imageRepository.saveAllAndFlush(imageEntities);
                     }
                }
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
    public BaseResponseModel<Integer> deleteProduct(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            ProductEntity productEntity = productRepository.findById(id).orElse(null);
            if(productEntity == null){
                response.errorResponse("Product not found");
                return response;
            }
            productRepository.updateStatus(id, status);
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
    public BaseListResponseModel<List<ProductModel>> getListProduct(Integer categoryId, Integer typeId, String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<List<ProductModel>> response = new BaseListResponseModel<>();
        try{
            Page<ProductEntity> entityList = productRepository.getListProduct(keySearch, categoryId, typeId, status, pageable);
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
