package com.example.backend_comic_service.develop.model.model;

import lombok.*;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class ProvinceModel {
    private String code;
    private String name;
    private String fullName;
    private String fullNameEn;
    private String codeName;
}
