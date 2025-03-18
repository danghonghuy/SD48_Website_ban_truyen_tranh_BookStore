package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.DistrictModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "districts")
public class DistrictEntity {
    @Id
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "name_en")
    private String nameEn;
    @Column(name = "full_name")
    private String fullName;
    @Column(name = "full_name_en")
    private String fullNameEn;
    @Column(name = "code_name")
    private String codeName;
    @ManyToOne
    @JoinColumn(name = "province_code")
    private ProvincesEntity province;
    @ManyToOne
    @JoinColumn(name = "administrative_unit_id")
    private AdministrativeUnitsEntity administrativeUnit;
    @OneToMany(mappedBy = "district", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<WardEntity> wardEntitySet;

    public DistrictModel todistrictModel() {
        DistrictModel districtModel = new DistrictModel();
        districtModel.setCode(code);
        districtModel.setName(name);
        districtModel.setNameEn(nameEn);
        districtModel.setFullName(fullName);
        districtModel.setFullNameEn(fullNameEn);
        districtModel.setCodeName(codeName);
        districtModel.setProvinceCode(province.getCode());
        return districtModel;
    }
}
