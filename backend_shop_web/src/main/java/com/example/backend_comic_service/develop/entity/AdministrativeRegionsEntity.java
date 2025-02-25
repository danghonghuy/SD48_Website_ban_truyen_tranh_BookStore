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
@Table(name = "administrative_regions")
public class AdministrativeRegionsEntity {
    @Id
    @Column(name = "id")
    private Integer id;
    @Column(name = "name")
    private String name;
    @Column(name = "name_en")
    private String nameEn;
    @Column(name = "code_name")
    private String codeName;
    @Column(name = "code_name_en")
    private String codeNameEn;
    @OneToMany(mappedBy = "administrativeRegionsEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProvincesEntity> provincesEntitySet;
}
