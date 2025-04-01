package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.RoleModel;
import com.example.backend_comic_service.develop.service.IRoleService;
import com.example.backend_comic_service.develop.service_impl.RoleServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/role")
public class RoleController {
    @Autowired
    private IRoleService roleServiceImpl;

    @PostMapping("/add-or-change")
    public BaseResponseModel<Integer> addOrChange(@RequestBody RoleModel roleModel) {
        return roleServiceImpl.addOrChange(roleModel);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<RoleModel> getById(@PathVariable Long id) {
        return roleServiceImpl.getRoleById(id);
    }
    @GetMapping("/delete")
    public BaseResponseModel<Long> delete(@RequestParam( value = "id",required = false)  Long id,
                                          @RequestParam( value = "status",required = false) Integer status) {
        return roleServiceImpl.deleteRole(id, status);
    }
    @GetMapping("/get-list-role")
    public BaseListResponseModel<List<RoleModel>> getListRole(@RequestParam( value = "keySearch",required = false) String keySearch,
                                                              @RequestParam( value = "status",required = false) Integer status,
                                                              @RequestParam(value = "pageIndex", required = true, defaultValue = "1") Integer pageIndex,
                                                              @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize) {
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize);
        return roleServiceImpl.getListRole(keySearch, status, pageable);
    }
}
