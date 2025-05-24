package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.RoleEntity;
import com.example.backend_comic_service.develop.model.model.RoleModel;
import com.example.backend_comic_service.develop.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;

@Component
public class RoleValidator {
    @Autowired
    private RoleRepository roleRepository;
    public String roleValidate(RoleModel model){
        if(model == null){
            return "Vai trò không hợp lệ";
        }
        if(!StringUtils.hasText(model.getName())){
            return "Tên vai trò không được để trống";
        }
        if(!StringUtils.hasText(model.getCode())){
            return "Mã vai trò không được để trống";
        }
        List<RoleEntity> entities = roleRepository.findRoleEntitiesByCode(model.getCode());
        if(!entities.isEmpty() && (model.getId() == null || !model.getId().equals(entities.get(0).getId()))){
            return "Mã vai trò đã tồn tại";
        }
        return "";
    }
}
