package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.TypeEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.TypeModel;
import com.example.backend_comic_service.develop.repository.TypeRepository;
import com.example.backend_comic_service.develop.repository.UserRepository;
import com.example.backend_comic_service.develop.service.ITypeService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.TypeValidator;
import io.swagger.v3.core.jackson.TypeNameResolver;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class TypeServiceImpl implements ITypeService {

    @Autowired
    private TypeRepository typeRepository;
    @Autowired
    private UtilService utilService;
    @Autowired
    private TypeValidator typeValidator;
    @Autowired
    private UserRepository userRepository;

    @Override
    public BaseResponseModel<TypeModel> addOrChange(TypeModel model) {
        BaseResponseModel<TypeModel> response = new BaseResponseModel<>();
        try{
            String errorMessage = typeValidator.validate(model);
            if(StringUtils.hasText(errorMessage)){
                response.errorResponse(errorMessage);
                return response;
            }
            TypeEntity typeEntity = new TypeEntity();
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                UserEntity userCreate = userRepository.findUserEntitiesByUserName(username).orElse(null);
                if (userCreate == null) {
                    response.errorResponse("User token is invalid");
                    return response;
                }
                if(Optional.ofNullable(model.getId()).orElse(0) == 0){
                    typeEntity = model.toEntity();
                    model.setCreatedBy(userCreate.getId());
                    model.setCreatedDate(LocalDateTime.now());
                }else{
                    typeEntity = typeRepository.findById(model.getId()).orElse(null);
                    if(typeEntity == null){
                        response.errorResponse("Type id is invalid");
                        return response;
                    }
                    typeEntity.setName(model.getName());
                    typeEntity.setDescription(model.getDescription());
                }
                model.setUpdatedBy(userCreate.getId());
                model.setUpdatedDate(LocalDateTime.now());
            } catch (Exception e) {
                log.error(e.getMessage());
                response.errorResponse(e.getMessage());
                return response;
            }
            TypeEntity type = typeRepository.saveAndFlush(typeEntity);
            if(typeEntity.getId() != null){
                response.successResponse(model, "Update successful");
                return response;
            }
            response.errorResponse("Add or change type failed");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<TypeModel> getTypeById(Integer id) {
        BaseResponseModel<TypeModel> response = new BaseResponseModel<>();
        try{
            TypeEntity typeEntity = typeRepository.findById(id).orElse(null);
            if(typeEntity == null){
                response.errorResponse("Type not found");
                return response;
            }
            TypeModel model = typeEntity.toModel();
            response.successResponse(model, "Success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> delete(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            TypeEntity typeEntity = typeRepository.findById(id).orElse(null);
            if(typeEntity == null){
                response.errorResponse("Type not found");
                return response;
            }
            typeEntity.setIsDeleted(1);
            typeEntity.setStatus(status);
            typeRepository.saveAndFlush(typeEntity);
            response.successResponse(id, "Delete type success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<List<TypeModel>> getListTypes(String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<List<TypeModel>> response = new BaseListResponseModel<>();
        try{
            Page<TypeEntity> entityList = typeRepository.getListType(keySearch, status, pageable);
            if(entityList == null){
                response.errorResponse("Discount list is empty");
                return response;
            }
            List<TypeModel> models = entityList.getContent().stream().map(TypeEntity::toModel).toList();
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
    public BaseResponseModel<String> generaTypeCode() {
        BaseResponseModel<String> response  = new BaseResponseModel<>();
        try{
            Integer idLastest =  typeRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("TYP", idLastest);
            response.successResponse(codeGender, "Generate discount code success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
