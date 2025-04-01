package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.CatalogEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.CatalogModel;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.repository.CatalogRepository;
import com.example.backend_comic_service.develop.repository.UserRepository;
import com.example.backend_comic_service.develop.service.ICatalogService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.CatalogValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class CatalogServiceImpl implements ICatalogService {

    private final CatalogRepository catalogRepository;
    private final CatalogValidator catalogValidator;
    private final UtilService utilService;
    private final UserRepository userRepository;

    @Autowired
    public CatalogServiceImpl(CatalogRepository catalogRepository, CatalogValidator catalogValidator, UtilService utilService, UserRepository userRepository) {
        this.catalogRepository = catalogRepository;
        this.catalogValidator = catalogValidator;
        this.utilService = utilService;
        this.userRepository = userRepository;
    }

    @Override
    public BaseListResponseModel<List<CatalogModel>> getList(String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<List<CatalogModel>> response = new BaseListResponseModel<>();
        try{
            Page<CatalogEntity> catalogEntities = catalogRepository.getList(keySearch, status, pageable);
            List<CatalogModel> catalogModels = new ArrayList<>();
            if(!catalogEntities.isEmpty()){
                catalogModels = catalogEntities.getContent().stream().map(CatalogEntity::toModel).toList();
            }
            response.setData(catalogModels);
            response.setPageSize(pageable.getPageNumber());
            response.setPageIndex(response.getPageIndex());
            response.setTotalCount(catalogEntities.getTotalPages());
            response.successResponse(catalogModels, "Sucsess");
            return  response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> addOrChange(CatalogModel catalogModel) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            String errorMessage = catalogValidator.validate(catalogModel);
            if(StringUtils.hasText(errorMessage)){
                response.errorResponse(errorMessage);
                return  response;
            }
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                UserEntity userCreate = userRepository.findUserEntitiesByUserName(username).orElse(null);
                if (userCreate == null) {
                    response.errorResponse("User token is invalid");
                    return response;
                }
                if(Optional.ofNullable(catalogModel.getId()).orElse(0) == 0){
                    catalogModel.setCreatedBy(userCreate.getId());
                    catalogModel.setCreatedDate(Date.valueOf(LocalDate.now()));
                }
                catalogModel.setUpdatedBy(userCreate.getId());
                catalogModel.setUpdatedDate(Date.valueOf(LocalDate.now()));
            } catch (Exception e) {
                log.error(e.getMessage());
                response.errorResponse(e.getMessage());
                return response;
            }
            CatalogEntity catalogEntitySave = catalogRepository.saveAndFlush(catalogModel.toEntity());
            if(catalogEntitySave.getId() != null){
                response.successResponse(catalogEntitySave.getId(), "Success");
                return response;
            }
            response.errorResponse("Update category fail");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return  response;
        }
    }

    @Override
    public BaseResponseModel<Integer> deleteCategory(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            if(id == null){
                response.errorResponse("Id not exist");
                return  response;
            }
            Optional<CatalogEntity> catalogEntity = catalogRepository.getCatalogEntityById(id);
            if(catalogEntity.isEmpty()){
                response.errorResponse("Category not exist with id " + id);
                return  response;
            }
            catalogRepository.updateCategory(catalogEntity.get().getId(), status);
            response.successResponse(catalogEntity.get().getId(), "Delete category success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return  response;
        }
    }

    @Override
    public BaseResponseModel<CatalogModel> getById(Integer id) {
        BaseResponseModel<CatalogModel> response = new BaseResponseModel<>();
        try{
            if(id == null){
                response.errorResponse("Id not exist");
                return  response;
            }
            Optional<CatalogEntity> catalogEntity = catalogRepository.getCatalogEntityById(id);
            if(catalogEntity.isEmpty()){
                response.errorResponse("Category not exist with id " + id);
                return  response;
            }
            response.successResponse(catalogEntity.get().toModel(), "Success");
            return  response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return  response;
        }
    }

    @Override
    public BaseResponseModel<String> generateCode() {
        BaseResponseModel<String> response  = new BaseResponseModel<>();
        try{
            Integer idLastest =  catalogRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("CATALOG", idLastest);
            response.successResponse(codeGender, "Generate category code success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
