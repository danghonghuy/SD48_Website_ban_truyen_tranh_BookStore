package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.RoleEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.RoleModel;
import com.example.backend_comic_service.develop.repository.RoleRepository;
import com.example.backend_comic_service.develop.service.IRoleService;
import com.example.backend_comic_service.develop.utils.AuthenticationService;
import com.example.backend_comic_service.develop.validator.RoleValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImpl implements IRoleService {

    private final RoleRepository roleRepository;
    private final RoleValidator roleValidator;
    private final AuthenticationService authenticationService;
    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository, RoleValidator roleValidator, AuthenticationService authenticationService) {
        this.roleRepository = roleRepository;
        this.roleValidator = roleValidator;
        this.authenticationService = authenticationService;
    }

    @Override
    public BaseResponseModel<Integer> addOrChange(RoleModel model) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            String errorString = roleValidator.roleValidate(model);
            if(StringUtils.hasText(errorString)) {
                response.errorResponse(errorString);
                return response;
            }
            UserEntity userEntity = authenticationService.authenToken();
            if(userEntity == null) {
                response.errorResponse("Authentication failed");
                return response;
            }
            RoleEntity roleEntity;
            if(model.getId() != null) {
                roleEntity = roleRepository.findRoleEntitiesById((long) model.getId()).orElse(null);
                if(roleEntity == null) {
                    response.errorResponse("Not exist role with id");
                    return response;
                }
                roleEntity.setName(model.getName());
            }else{
                roleEntity = model.toRoleEntity();
                roleEntity.setCreatedBy(userEntity.getId());
                roleEntity.setCreatedDate(Date.valueOf(LocalDate.now()));
            }
            roleEntity.setUpdatedBy(userEntity.getId());
            roleEntity.setUpdatedDate(Date.valueOf(LocalDate.now()));
            RoleEntity roleSave =  roleRepository.save(roleEntity);
            if(roleSave.getId() != null) {
                response.successResponse(roleSave.getId(),  "Update success" );
                return response;
            }
            response.errorResponse("Insert fail");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public  BaseResponseModel<Long> deleteRole(Long id, Integer status) {
        BaseResponseModel<Long> response = new BaseResponseModel<>();
        try{
            Optional<RoleEntity> roleEntity = roleRepository.findRoleEntitiesById(id);
            if(roleEntity.isEmpty()) {
                response.errorResponse("Role entity not exist");
                return response;
            }
            RoleEntity role = roleEntity.get();
            role.setIsDelete(1);
            role.setStatus(status);
            roleRepository.saveAndFlush(role);
            response.successResponse(id, "Role delete success");
            return  response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<List<RoleModel>> getListRole(String keySearch,Integer status, Pageable pageable) {
        BaseListResponseModel<List<RoleModel>> response = new BaseListResponseModel<>();
        try{
            Page<RoleEntity> roleEntities = roleRepository.findListRoleEntities(keySearch, status, pageable);
            if(roleEntities.isEmpty()) {
                response.errorResponse("Role entity not exist");
                return response;
            }
            final var models = roleEntities.getContent().stream().map(RoleEntity::toRoleModel).toList();
            if(models.isEmpty()) {
                response.errorResponse("Role entity not exist");
                return response;
            }
            response.successResponse(models, "Success");
            response.setTotalCount((int) roleEntities.getTotalElements());
            response.setPageIndex(pageable.getPageNumber());
            response.setPageSize(pageable.getPageSize());
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<RoleModel> getRoleById(Long id) {
        BaseResponseModel<RoleModel> response = new BaseResponseModel<>();
        try{
            RoleEntity roleEntity = roleRepository.findRoleEntitiesById(id).orElse(null);
            if(roleEntity == null) {
                response.errorResponse("Role entity not exist");
                return response;
            }
            RoleModel roleModel = roleEntity.toRoleModel();
            response.successResponse(roleModel, "Success");
            return response;
        }catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
