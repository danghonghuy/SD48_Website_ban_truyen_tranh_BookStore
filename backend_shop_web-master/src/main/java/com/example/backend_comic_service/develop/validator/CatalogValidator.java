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
            return "Danh mục không được để trống";
        }
        if(!StringUtils.hasText(model.getName())){
            return "Tên danh mục không được để trống";
        }
        if(!StringUtils.hasText(model.getCode())){
            return "Mã danh mục không được để trống";
        }
        List<CatalogEntity> entities = catalogRepository.getByCode(model.getCode());
        if(!entities.isEmpty() && (model.getId() == null || !model.getId().equals(entities.get(0).getId()))){
            return "Mã danh mục đã tồn tại";
        }
        return "";
    }
}
