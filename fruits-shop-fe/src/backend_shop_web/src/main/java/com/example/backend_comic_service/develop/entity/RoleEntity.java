package com.example.backend_comic_service.develop.entity;


import com.example.backend_comic_service.develop.model.model.RoleModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "role")
public class RoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "created_date")
    private Date createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_date")
    private Date updatedDate;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @Column(name = "status")
    private Integer status;
    @Column(name = "is_delete")
    private Integer isDelete;
    public static RoleEntity fromRoleModel(RoleModel roleModel) {
      try{
          RoleEntity roleEntity = new RoleEntity();
          roleEntity.setId(roleModel.getId());
          roleEntity.setCode(roleModel.getCode());
          roleEntity.setName(roleModel.getName());
          roleEntity.setCreatedDate(Date.valueOf(LocalDate.now()));
          roleEntity.setUpdatedDate(Date.valueOf(LocalDate.now()));
          roleEntity.setStatus(roleModel.getStatus());
          roleEntity.setIsDelete(roleModel.getIsDeleted());
          return roleEntity;
      }
      catch (Exception e){
          return null;
      }
    }
    public RoleModel toRoleModel(){
        RoleModel roleModel = new RoleModel();
        roleModel.setId(this.getId());
        roleModel.setCode(this.getCode());
        roleModel.setName(this.getName());
        roleModel.setCreatedDate(this.getCreatedDate());
        roleModel.setCreatedBy(this.getCreatedBy());
        roleModel.setUpdatedDate(this.getUpdatedDate());
        roleModel.setUpdatedBy(this.getUpdatedBy());
        roleModel.setStatus(this.getStatus());
        roleModel.setIsDeleted(this.getIsDelete());
        return roleModel;
    }
}
