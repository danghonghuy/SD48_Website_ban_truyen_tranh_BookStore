package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.RoleEntity;
import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RoleModel {
    private Integer id;
    private String code;
    private String name;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdDate;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime updatedDate;
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
