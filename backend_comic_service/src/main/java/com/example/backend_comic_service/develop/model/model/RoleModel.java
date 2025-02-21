package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.RoleEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RoleModel {
    private Integer id;
    private String code;
    private String name;
    private Date createdDate;
    private Date updatedDate;
    private Integer createdBy;
    private Integer updatedBy;
    private Integer status;
    private Integer isDeleted;
    public RoleEntity toRoleEntity() {
        RoleEntity roleEntity = new RoleEntity();
        roleEntity.setId(id);
        roleEntity.setCode(code);
        roleEntity.setName(name);
        roleEntity.setCreatedDate(createdDate);
        roleEntity.setUpdatedDate(updatedDate);
        roleEntity.setCreatedBy(createdBy);
        roleEntity.setUpdatedBy(updatedBy);
        roleEntity.setStatus(status);
        roleEntity.setIsDelete(isDeleted);
        return roleEntity;
    }
}
