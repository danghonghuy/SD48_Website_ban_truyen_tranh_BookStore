package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.AddressModel;
import com.example.backend_comic_service.develop.model.model.UserModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class UserEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "code")
    private String code;
    @Column(name = "full_name")
    private String fullName;
    @Column(name =  "image_url")
    private String imageUrl;
    @Column(name =  "phone_number")
    private  String phoneNumber;
    @Column(name =  "email")
    private String email;
    @Column(name = "description")
    private String description;
    @Column(name = "date_birth")
    private Date dateBirth;
    @Column(name = "gender")
    private boolean gender;
    @Column(name = "user_name")
    private String userName;
    @Column(name = "password")
    private String password;
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
    @Column(name = "status")
    private Integer status;
    @ManyToOne
    @JoinColumn(name = "role_id")
    private RoleEntity roleEntity;
    @Column(name = "is_deleted")
    private Integer isDeleted;
    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AddressEntity> addressEntities;
    public UserModel toUserModel() {
        UserModel userModel = new UserModel();
        userModel.setId(id);
        userModel.setCode(code);
        userModel.setFullName(fullName);
        userModel.setImageUrl(imageUrl);
        userModel.setPhoneNumber(phoneNumber);
        userModel.setEmail(email);
        userModel.setDescription(description);
        userModel.setDateBirth(dateBirth);
        userModel.setGender(gender);
        userModel.setUserName(userName);
        userModel.setCreatedDate(createdDate);
        userModel.setCreatedBy(createdBy);
        userModel.setUpdatedDate(updatedDate);
        userModel.setUpdatedBy(updatedBy);
        userModel.setUpdatedDate(updatedDate);
        userModel.setStatus(status);
        userModel.setRoleId(roleEntity.getId());
        userModel.setRoleCode(roleEntity.getCode());
        if(addressEntities != null && !addressEntities.isEmpty()){
            List<AddressModel> models = new ArrayList<>();
            addressEntities.forEach(item -> {
                AddressModel model = item.toModel();
                models.add(model);
            });
            userModel.setAddress(models);
        }
        return userModel;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
