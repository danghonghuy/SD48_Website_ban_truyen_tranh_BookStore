package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.CategoryEntity;
import com.example.backend_comic_service.develop.entity.RoleEntity;
import com.example.backend_comic_service.develop.model.model.CategoryModel;
import com.example.backend_comic_service.develop.model.model.RoleModel;
import com.example.backend_comic_service.develop.repository.CategoryRepository;
import com.example.backend_comic_service.develop.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Component
public class CategoryValidator {
    @Autowired
    private CategoryRepository categoryRepository;
    public String validate(CategoryModel model){
        if(model == null){
            return "Thể loại không được để trống";
        }
        if(!StringUtils.hasText(model.getName())){
            return "Tên thể loại không được để trống";
        }
        if(!StringUtils.hasText(model.getCode())){
            return "Mã thể loại không được để trống";
        }
        if(Optional.ofNullable(model.getCatalogId()).orElse(0) <= 0){
            return "ID danh mục không được để trống";
        }
        List<CategoryEntity> entities = categoryRepository.getCategoryEntitiesByCode(model.getCode());
        if(!entities.isEmpty() && (model.getId() == null || !   model.getId().equals(entities.get(0).getId()))){
            return "Mã đã tồn tại";
        }
        return "";
    }
}
