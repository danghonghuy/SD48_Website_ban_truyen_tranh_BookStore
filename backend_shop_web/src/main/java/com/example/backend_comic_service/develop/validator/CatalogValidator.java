package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.CatalogEntity;
import com.example.backend_comic_service.develop.model.CatalogModel;
import com.example.backend_comic_service.develop.repository.CatalogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
@Component
public class CatalogValidator {
    @Autowired
    private CatalogRepository catalogRepository;

    public String validate(CatalogModel model){
        if(model == null){
            return "Catalog is null";
        }
        if(!StringUtils.hasText(model.getName())){
            return "Name is null";
        }
        if(!StringUtils.hasText(model.getCode())){
            return "Code is null";
        }
        List<CatalogEntity> entities = catalogRepository.getByCode(model.getCode());
        if(!entities.isEmpty() && (model.getId() == null || !model.getId().equals(entities.get(0).getId()))){
            return "Code already exists";
        }
        return "";
    }
}
