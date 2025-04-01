package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.CatalogModel;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;

import com.example.backend_comic_service.develop.service.ICatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/catalog")
public class CatalogController {

    @Autowired
    private ICatalogService catalogService;

    @PostMapping("/add-or-change")
    public BaseResponseModel<Integer> addOrChange(@RequestBody CatalogModel model){
        return catalogService.addOrChange(model);
    }
    @GetMapping("/delete")
    public BaseResponseModel<Integer> deleteCatalog(@RequestParam(value = "id", required = false)  Integer id, @RequestParam(value = "status", required = false)  Integer status){
        return catalogService.deleteCategory(id,status);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<CatalogModel> getCategoryDetail(@PathVariable Integer id){
        return catalogService.getById(id);
    }
    @GetMapping("/get-list")
    public BaseListResponseModel<List<CatalogModel>> getListCategory(@RequestParam(value = "keySearch", required = false) String keySearch,
                                                                      @RequestParam(value = "status", required = false) Integer status,
                                                                      @RequestParam(value = "pageIndex", defaultValue = "0") Integer pageIndex,
                                                                      @RequestParam(value = "pageSize",  defaultValue = "10") Integer pageSize){
        Pageable pageable =  PageRequest.of(pageIndex - 1, pageSize);
        return  catalogService.getList(keySearch, status, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return catalogService.generateCode();
    }

}