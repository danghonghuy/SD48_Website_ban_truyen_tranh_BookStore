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
import java.time.LocalDateTime;
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
                response.errorResponse("Xác thực không thành công");
                return response;
            }
            RoleEntity roleEntity;
            if(model.getId() != null) {
                roleEntity = roleRepository.findRoleEntitiesById((long) model.getId()).orElse(null);
                if(roleEntity == null) {
                    response.errorResponse("Không tồn tại vai trò với ID này");
                    return response;
                }
                roleEntity.setName(model.getName());
            }else{
                roleEntity = model.toRoleEntity();
                roleEntity.setCreatedBy(userEntity.getId());
                roleEntity.setCreatedDate(LocalDateTime.now());
            }
            roleEntity.setUpdatedBy(userEntity.getId());
            roleEntity.setUpdatedDate(LocalDateTime.now());
            RoleEntity roleSave =  roleRepository.save(roleEntity);
            if(roleSave.getId() != null) {
                response.successResponse(roleSave.getId(),  "Cập nhật thành công" );
                return response;
            }
            response.errorResponse("Thêm thất bại");
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
                response.errorResponse("Vai trò không tồn tại");
                return response;
            }
            RoleEntity role = roleEntity.get();
            role.setIsDelete(1);
            role.setStatus(status);
            roleRepository.saveAndFlush(role);
            response.successResponse(id, "Xóa vai trò thành công");
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
                response.errorResponse("Danh sách vai trò trống");
                return response;
            }
            final var models = roleEntities.getContent().stream().map(RoleEntity::toRoleModel).toList();
            if(models.isEmpty()) {
                response.errorResponse("Vai trò không tồn tại");
                return response;
            }
            response.successResponse(models, "Thành công");
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
                response.errorResponse("Vai trò không tồn tại");
                return response;
            }
            RoleModel roleModel = roleEntity.toRoleModel();
            response.successResponse(roleModel, "Thành công");
            return response;
        }catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
