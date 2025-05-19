package com.example.backend_comic_service.develop.entity;

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
@Table(name = "administrative_units")
public class AdministrativeUnitsEntity {
    @Id
    @Column(name = "id")
    private Integer id;
    @Column(name = "full_name")
    private String fullName;
    @Column(name = "full_name_en")
    private String fullNameEn;
    @Column(name = "short_name")
    private String shortName;
    @Column(name = "short_name_en")
    private String shortNameEn;
    @Column(name = "code_name")
    private String codeName;
    @Column(name = "code_name_en")
    private String codeNameEn;
    @OneToMany(mappedBy = "administrativeUnits", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProvincesEntity> provincesEntitySet;
    @OneToMany(mappedBy = "administrativeUnit", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DistrictEntity> districtEntitySet;
    @OneToMany(mappedBy = "administrativeUnitWard", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<WardEntity> wardEntitySet;
}
