package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.CategoryEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CategoryModel;
import com.example.backend_comic_service.develop.repository.CategoryRepository;
import com.example.backend_comic_service.develop.service.ICategoryService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.CategoryValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements ICategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryValidator categoryValidator;
    @Autowired
    private UtilService utilService;

    @Override
    public BaseListResponseModel<List<CategoryModel>> getListCategory(String name, String code, Integer status, Pageable pageable) {
        BaseListResponseModel<List<CategoryModel>> response = new BaseListResponseModel<>();
        try{
            Page<CategoryEntity> categoryEntities = categoryRepository.getListCategory(code, name, status, pageable);
            List<CategoryModel> categoryModels = new ArrayList<>();
            if(!categoryEntities.isEmpty()){
               categoryModels = categoryEntities.getContent().stream().map(CategoryEntity::categoryModel).toList();
            }
            response.setData(categoryModels);
            response.setPageSize(pageable.getPageNumber());
            response.setPageIndex(response.getPageIndex());
            response.setTotalCount(categoryEntities.getTotalPages());
            response.successResponse(categoryModels, "Sucsess");
            return  response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> addOrChange(CategoryModel categoryModel) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            String errorMessage = categoryValidator.validate(categoryModel);
            if(StringUtils.hasText(errorMessage)){
                response.errorResponse(errorMessage);
                return  response;
            }
            CategoryEntity categoryEntitySave = categoryRepository.saveAndFlush(categoryModel.categoryEntity());
            if(categoryEntitySave.getId() != null){
                response.successResponse(categoryEntitySave.getId(), "Success");
                return response;
            }
            response.errorResponse("Update category fail");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return  response;
        }
    }

    @Override
    public BaseResponseModel<Integer> deleteCategory(Integer id) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            if(id == null){
                response.errorResponse("Id not exist");
                return  response;
            }
            Optional<CategoryEntity> categoryEntityOption = categoryRepository.getCategoryEntitiesById(id);
            if(categoryEntityOption.isEmpty()){
                response.errorResponse("Category not exist with id " + id);
                return  response;
            }
            categoryRepository.updateCategory(categoryEntityOption.get().getId());
            response.successResponse(categoryEntityOption.get().getId(), "Delete category success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return  response;
        }
    }

    @Override
    public BaseResponseModel<CategoryModel> getCategoryDetail(Integer id) {
        BaseResponseModel<CategoryModel> response = new BaseResponseModel<>();
        try{
            if(id == null){
                response.errorResponse("Id not exist");
                return  response;
            }
            Optional<CategoryEntity> categoryEntityOption = categoryRepository.getCategoryEntitiesById(id);
            if(categoryEntityOption.isEmpty()){
                response.errorResponse("Category not exist with id " + id);
                return  response;
            }
            response.successResponse(categoryEntityOption.get().categoryModel(), "Success");
            return  response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return  response;
        }
    }

    @Override
    public BaseResponseModel<String> generateCode() {
        BaseResponseModel<String> response  = new BaseResponseModel<>();
        try{
            Integer idLastest =  categoryRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("CAT", idLastest);
            response.successResponse(codeGender, "Generate category code success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
