package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.model.model.TypeModel;
import com.example.backend_comic_service.develop.service.ITypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/types")
public class TypeController {

    @Autowired
    private ITypeService typeService;

    @PostMapping("/add-or-change")
    public BaseResponseModel<TypeModel> addOrChange(@RequestBody TypeModel model) {
        return typeService.addOrChange(model);
    }
    @GetMapping("/delete")
    public BaseResponseModel<Integer> delete(@RequestParam(value = "id", required = false)Integer id, @RequestParam(value = "status", required = false)Integer status) {
        return typeService.delete(id,status);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<TypeModel> detail(@PathVariable Integer id) {
        return typeService.getTypeById(id);
    }
    @GetMapping("/get-list-type")
    public BaseListResponseModel<List<TypeModel>> getListDiscount( @RequestParam(value = "keySearch", required = false) String keySearch,
                                                                      @RequestParam(value = "status", required = false) Integer status,
                                                                      @RequestParam(value = "pageIndex") Integer pageIndex,
                                                                      @RequestParam(value = "pageSize") Integer pageSize) {
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize);
        return typeService.getListTypes(keySearch, status, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return typeService.generaTypeCode();
    }
}
