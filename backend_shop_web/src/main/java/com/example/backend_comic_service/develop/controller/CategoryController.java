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
    @DeleteMapping("/delete/{id}")
    public BaseResponseModel<Integer> deleteCategory(@PathVariable Integer id){
        return categoryService.deleteCategory(id);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<CategoryModel> getCategoryDetail(@PathVariable Integer id){
        return categoryService.getCategoryDetail(id);
    }
    @GetMapping("/get-category-list")
    public BaseListResponseModel<List<CategoryModel>> getListCategory(@RequestParam( value = "name",required = false) String name,
                                                                      @RequestParam(value = "code", required = false) String code,
                                                                      @RequestParam(value = "status", required = false) Integer status,
                                                                      @RequestParam(value = "pageIndex", required = true, defaultValue = "0") Integer pageIndex,
                                                                      @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize){
        Pageable pageable =  PageRequest.of(pageIndex, pageSize);
        return  categoryService.getListCategory(name, code, status, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return categoryService.generateCode();
    }

}
