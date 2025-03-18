package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserModel {
    private Integer id;
    private String code;
    private String fullName;
    private String imageUrl;
    private String phoneNumber;
    private String email;
    private String description;
    private Date dateBirth;
    private boolean gender;
    private String userName;
    private String password;
    private Date createdDate;
    private Date updatedDate;
    private Integer createdBy;
    private Integer updatedBy;
    private Integer status;
    private Integer roleId;

    public UserEntity toUserEntity() {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(id);
        userEntity.setCode(code);
        userEntity.setFullName(fullName);
        userEntity.setImageUrl(imageUrl);
        userEntity.setPhoneNumber(phoneNumber);
        userEntity.setEmail(email);
        userEntity.setDescription(description);
        userEntity.setDateBirth(dateBirth);
        userEntity.setGender(gender);
        userEntity.setUserName(userName);
        userEntity.setPassword(password);
        userEntity.setCreatedDate(Date.valueOf(LocalDate.now()));
        userEntity.setUpdatedDate(Date.valueOf(LocalDate.now()));
        userEntity.setCreatedBy(createdBy);
        userEntity.setUpdatedBy(updatedBy);
        userEntity.setStatus(status);
        return userEntity;
    }
}
