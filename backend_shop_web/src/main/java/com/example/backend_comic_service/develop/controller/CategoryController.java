package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CategoryModel;
import com.example.backend_comic_service.develop.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/category")
public class CategoryController {

    @Autowired
    private ICategoryService categoryService;

    @PostMapping("/add-or-change")
    public BaseResponseModel<Integer> addOrChange(@RequestBody CategoryModel model){
        return categoryService.addOrChange(model);
    }
    @GetMapping("/delete")
    public BaseResponseModel<Integer> deleteCategory(@RequestParam(value = "id", required = false)  Integer id,
                                                     @RequestParam(value = "status", required = false)  Integer status){
        return categoryService.deleteCategory(id, status);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<CategoryModel> getCategoryDetail(@PathVariable Integer id){
        return categoryService.getCategoryDetail(id);
    }
    @GetMapping("/get-category-list")
    public BaseListResponseModel<List<CategoryModel>> getListCategory(@RequestParam(value = "keySearch", required = false) String keySearch,
                                                                      @RequestParam(value = "status", required = false) Integer status,
                                                                      @RequestParam(value = "pageIndex", defaultValue = "0") Integer pageIndex,
                                                                      @RequestParam(value = "pageSize",  defaultValue = "10") Integer pageSize){
        Pageable pageable =  PageRequest.of(pageIndex - 1, pageSize);
        return  categoryService.getListCategory(keySearch, status, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return categoryService.generateCode();
    }

}
