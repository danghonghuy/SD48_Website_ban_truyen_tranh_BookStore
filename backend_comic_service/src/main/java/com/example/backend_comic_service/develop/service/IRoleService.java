package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.RoleModel;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IRoleService {

    BaseResponseModel<Integer> addOrChange(RoleModel model);

    BaseResponseModel<Long> deleteRole(Long id);

    BaseListResponseModel<List<RoleModel>> getListRole(String code, String name, Pageable pageable);
    BaseResponseModel<RoleModel> getRoleById(Long id);
}
