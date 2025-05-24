package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.AddressModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
// Thêm import cho log nếu bạn dùng log trong toModel
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "address")
public class AddressEntity {
    // private static final Logger log = LoggerFactory.getLogger(AddressEntity.class); // Nếu bạn muốn log

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "address_detail")
    private String addressDetail;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "updated_by")
    private Integer updatedBy;

    @Column(name = "status")
    private Integer status;

    @Column(name = "is_deleted")
    private Integer isDeleted;

    @ManyToOne(fetch = FetchType.EAGER) // << --- THAY ĐỔI Ở ĐÂY
    @JoinColumn(name = "district_id")
    private DistrictEntity district;

    @ManyToOne(fetch = FetchType.EAGER) // << --- THAY ĐỔI Ở ĐÂY
    @JoinColumn(name = "ward_id")
    private WardEntity ward;

    @ManyToOne(fetch = FetchType.EAGER) // << --- THAY ĐỔI Ở ĐÂY
    @JoinColumn(name = "province_id")
    private ProvincesEntity province;

    @Column(name = "description")
    private String description;

    @ManyToOne // FetchType mặc định cho ManyToOne thường là EAGER, nhưng có thể để rõ ràng
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    @Column(name = "is_default")
    public Integer isDefault;

    public AddressModel toModel(){
        AddressModel addressModel = new AddressModel();
        addressModel.setId(this.id);
        addressModel.setAddressDetail(this.addressDetail);
        addressModel.setCreatedDate(this.createdDate);
        addressModel.setCreatedBy(this.createdBy);
        addressModel.setUpdatedBy(this.updatedBy);
        addressModel.setUpdatedDate(this.updatedDate);
        addressModel.setStage(1); // Mặc định stage là 1 khi chuyển đổi, có thể cần điều chỉnh nếu stage có ý nghĩa khác

        if (this.userEntity != null) { // Kiểm tra userEntity trước khi lấy ID
            addressModel.setUserId(this.userEntity.getId());
        } else {
            addressModel.setUserId(null);
            // log.warn("AddressEntity ID {} has null userEntity during toModel() conversion.", this.id);
        }

        if (this.province != null) {
            addressModel.setProvinceId(this.province.getCode());
            addressModel.setProvinceName(this.province.getName());
        } else {
            addressModel.setProvinceId(null);
            addressModel.setProvinceName(null);
            // log.warn("AddressEntity ID {} has null province during toModel() conversion.", this.id);
        }

        if (this.district != null) {
            addressModel.setDistrictId(this.district.getCode());
            addressModel.setDistrictName(this.district.getName());
        } else {
            addressModel.setDistrictId(null);
            addressModel.setDistrictName(null);
            // log.warn("AddressEntity ID {} has null district during toModel() conversion.", this.id);
        }

        if (this.ward != null) {
            addressModel.setWardId(this.ward.getCode());
            addressModel.setWardName(this.ward.getName());
        } else {
            addressModel.setWardId(null);
            addressModel.setWardName(null);
            // log.warn("AddressEntity ID {} has null ward during toModel() conversion.", this.id);
        }

        addressModel.setIsDefault(this.isDefault);
        return addressModel;
    }
}