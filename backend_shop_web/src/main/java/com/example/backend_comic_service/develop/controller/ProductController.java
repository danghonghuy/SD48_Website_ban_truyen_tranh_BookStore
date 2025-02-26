package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    private IProductService productService;

    @PostMapping("/add-or-change")
    public BaseResponseModel<ProductModel> addOrChange(@RequestBody ProductModel productModel) {
        return productService.addOrChangeProduct(productModel);
    }
    @DeleteMapping("/delete/{id}")
    public BaseResponseModel<Integer> delete(@PathVariable Integer id) {
        return productService.deleteProduct(id);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<ProductModel> detail(@PathVariable Integer id) {
        return productService.getProductById(id);
    }
    @GetMapping("/get-list-product")
    public BaseListResponseModel<List<ProductModel>> getListDiscount(@RequestParam(value = "keySearch", required = false) String keySearch,
                                                                     @RequestParam(value = "categoryId", required = false) Integer categoryId,
                                                                     @RequestParam(value = "typeId", required = false) Integer typeId,
                                                                     @RequestParam(value = "pageIndex") Integer pageIndex,
                                                                     @RequestParam(value = "pageSize") Integer pageSize) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        return productService.getListProduct(categoryId, typeId, keySearch, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return productService.generateCode();
    }

}
