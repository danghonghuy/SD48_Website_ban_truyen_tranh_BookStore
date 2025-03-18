package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.entity.TypeEntity;
import com.example.backend_comic_service.develop.model.model.TypeModel;
import com.example.backend_comic_service.develop.repository.TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class TypeValidator {

    @Autowired
    private TypeRepository typeRepository;

    public String validate(TypeModel model) {
        if (model == null) {
            return "Type is null";
        }
        if (!StringUtils.hasText(model.getName())) {
            return "Type name is empty";
        }
        if (!StringUtils.hasText(model.getCode()) && model.getId() == null) {
            return "Type code is empty";
        }
        if (model.getId() != null) {
            TypeEntity typeEntity = typeRepository.findByCode(model.getCode()).orElse(null);
            if (typeEntity != null && !typeEntity.getId().equals(model.getId())) {
                return "Type code is exist";
            }
        }
        return "";
    }
}
