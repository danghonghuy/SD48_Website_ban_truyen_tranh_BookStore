package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CategoryModel;
import com.example.backend_comic_service.develop.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public BaseListResponseModel<CategoryModel> getListCategory(
            @RequestParam(value = "keySearch", required = false) String keySearch,
            @RequestParam(value = "status", required = false) Integer status,
            @RequestParam(value = "pageIndex", defaultValue = "1") Integer pageIndex, // Nhận từ client, mặc định là 1
            @RequestParam(value = "pageSize",  defaultValue = "10") Integer pageSize) {

        // Đảm bảo pageIndex không bao giờ dẫn đến giá trị âm cho PageRequest
        int actualPageIndex = (pageIndex == null || pageIndex <= 0) ? 0 : pageIndex - 1;
        // Nếu pageIndex từ client là 1, actualPageIndex sẽ là 0.
        // Nếu pageIndex từ client là 0 hoặc âm, actualPageIndex cũng sẽ là 0 (trang đầu tiên).

        Pageable pageable = PageRequest.of(actualPageIndex, pageSize, Sort.by("id").descending());

        return categoryService.getListCategory(keySearch, status, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return categoryService.generateCode();
    }

}
