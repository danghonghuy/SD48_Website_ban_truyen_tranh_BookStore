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
// Thêm import cho log nếu bạn dùng log
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors; // Thêm nếu dùng stream cho address
import java.util.Objects;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class UserEntity implements UserDetails {
    // private static final Logger log = LoggerFactory.getLogger(UserEntity.class); // Nếu bạn muốn log

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    // ... (các trường code, fullName, imageUrl, phoneNumber, email, description giữ nguyên) ...
    @Column(name = "code")
    private String code;
    @Column(name = "full_name")
    private String fullName;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "phone_number")
    private String phoneNumber;
    @Column(name = "email")
    private String email;
    @Column(name = "description")
    private String description;


    @Column(name = "date_birth")
    private LocalDate dateBirth;

    @Column(name = "gender")
    private boolean gender; // Giữ nguyên là boolean

    // ... (các trường userName, password, createdDate, createdBy, updatedBy, updatedDate, status giữ nguyên) ...
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


    @ManyToOne(fetch = FetchType.EAGER) // << --- NÊN LÀ EAGER NẾU BẠN LUÔN CẦN ROLE KHI LẤY USER
    @JoinColumn(name = "role_id")
    private RoleEntity roleEntity;

    @Column(name = "is_deleted")
    private Integer isDeleted;

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER) // << --- THAY ĐỔI Ở ĐÂY
    private Set<AddressEntity> addressEntities;

    public UserModel toUserModel() {
        UserModel userModel = new UserModel();
        userModel.setId(this.id);
        userModel.setCode(this.code);
        userModel.setFullName(this.fullName);
        userModel.setImageUrl(this.imageUrl);
        userModel.setPhoneNumber(this.phoneNumber);
        userModel.setEmail(this.email);
        userModel.setDescription(this.description);

        if (this.dateBirth != null) {
            userModel.setDateBirth(this.dateBirth.atStartOfDay());
        } else {
            userModel.setDateBirth(null);
        }

        userModel.setGender(this.gender); // UserModel.gender là boolean, khớp với UserEntity.gender
        userModel.setUserName(this.userName);
        // Không trả về password
        userModel.setCreatedDate(this.createdDate);
        userModel.setCreatedBy(this.createdBy);
        userModel.setUpdatedDate(this.updatedDate); // Dòng này bị lặp, đã sửa
        userModel.setUpdatedBy(this.updatedBy);
        // userModel.setUpdatedDate(this.updatedDate); // Dòng lặp, bỏ đi
        userModel.setStatus(this.status);

        if (this.roleEntity != null) {
            userModel.setRoleId(this.roleEntity.getId().intValue()); // Giả sử RoleEntity.id là Long
            userModel.setRoleCode(this.roleEntity.getCode());
        } else {
            userModel.setRoleId(null);
            userModel.setRoleCode(null);
            // log.warn("UserEntity ID {} has null roleEntity during toUserModel() conversion.", this.id);
        }

        if (this.addressEntities != null && !this.addressEntities.isEmpty()) {
            // Cách dùng stream hiệu quả hơn:
            List<AddressModel> models = this.addressEntities.stream()
                    .filter(Objects::nonNull) // Lọc ra những item không null trong Set
                    .map(AddressEntity::toModel) // Gọi hàm toModel của mỗi AddressEntity
                    .collect(Collectors.toList());
            userModel.setAddress(models);
        } else {
            userModel.setAddress(new ArrayList<>()); // Luôn trả về một list (có thể rỗng)
        }
        return userModel;
    }

    // ... (UserDetails methods giữ nguyên) ...
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Thông thường, bạn sẽ map RoleEntity sang SimpleGrantedAuthority ở đây
        if (this.roleEntity != null && this.roleEntity.getCode() != null) {
            return List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + this.roleEntity.getCode()));
        }
        return List.of();
    }

    @Override
    public String getUsername() {
        return this.userName;
    }
    // ...
    @Override
    public boolean isAccountNonExpired() {
        return true; // Hoặc logic của bạn
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Hoặc logic của bạn
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Hoặc logic của bạn
    }

    @Override
    public boolean isEnabled() {
        return this.status != null && this.status == 1 && (this.isDeleted == null || this.isDeleted == 0) ; // Ví dụ: active và không bị xóa
    }
}