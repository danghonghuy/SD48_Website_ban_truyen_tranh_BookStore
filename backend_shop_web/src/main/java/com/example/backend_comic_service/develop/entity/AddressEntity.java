package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.AddressModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "address")
public class AddressEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "address_detail")
    private String addressDetail;
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
    @Column(name = "is_deleted")
    private Integer isDeleted;
    @ManyToOne
    @JoinColumn(name = "district_id")
    private DistrictEntity district;
    @ManyToOne
    @JoinColumn(name = "ward_id")
    private WardEntity ward;
    @ManyToOne
    @JoinColumn(name = "province_id")
    private ProvincesEntity province;
    @Column(name = "description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;
    @Column(name = "is_default")
    public Integer isDefault;
    public AddressModel toModel(){
        AddressModel addressModel = new AddressModel();
        addressModel.setId(id);
        addressModel.setAddressDetail(addressDetail);
        addressModel.setCreatedDate(createdDate);
        addressModel.setCreatedBy(createdBy);
        addressModel.setUpdatedBy(updatedBy);
        addressModel.setUpdatedDate(updatedDate);
        addressModel.setStage(1);
        addressModel.setUserId(userEntity.getId());
        addressModel.setProvinceId(province != null ?  province.getCode() : null);
        addressModel.setProvinceName(province != null ? province.getName(): null);
        addressModel.setDistrictId(district != null ? district.getCode(): null);
        addressModel.setDistrictName(district != null ? district.getName(): null);
        addressModel.setWardId(ward != null ? ward.getCode(): null);
        addressModel.setWardName(ward != null ? ward.getName(): null);
        addressModel.setIsDefault(isDefault);
        return addressModel;
    }
}
