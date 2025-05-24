package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.model.model.ProvinceModel;
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
@Table(name = "provinces")
public class ProvincesEntity {
    @Id
    @Column(name = "code")
    private String code;
    @Column(name = "name")
    private String name;
    @Column(name = "full_name")
    private String fullName;
    @Column(name = "full_name_en")
    private String fullNameEn;
    @Column(name = "code_name")
    private String codeName;
    @ManyToOne
    @JoinColumn(name = "administrative_unit_id")
    private AdministrativeUnitsEntity administrativeUnits;
    @ManyToOne
    @JoinColumn(name = "administrative_region_id")
    private AdministrativeRegionsEntity administrativeRegionsEntity;
    @OneToMany(mappedBy = "province", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DistrictEntity> districtEntitySet;

    public ProvinceModel toProvinceModel() {
        ProvinceModel productModel = new ProvinceModel();
        productModel.setCode(code);
        productModel.setName(name);
        productModel.setFullName(fullName);
        productModel.setFullNameEn(fullNameEn);
        productModel.setCodeName(codeName);
        return productModel;
    }
}
