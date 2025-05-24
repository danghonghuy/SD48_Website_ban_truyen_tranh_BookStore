package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.WardModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "wards")
public class WardEntity {
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
    @JoinColumn(name = "district_code")
    private DistrictEntity district;
    @ManyToOne
    @JoinColumn(name = "administrative_unit_id")
    private AdministrativeUnitsEntity administrativeUnitWard;

    public WardModel toWardModel() {
        WardModel wardModel = new WardModel();
        wardModel.setCode(code);
        wardModel.setName(name);
        wardModel.setNameEn(nameEn);
        wardModel.setFullName(fullName);
        wardModel.setFullNameEn(fullNameEn);
        wardModel.setCodeName(codeName);
        wardModel.setDistrictCode(district.getCode());
        return wardModel;
    }
}
