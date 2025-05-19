package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.exception.ResponseFactory;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.excel.ExcelData;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.model.request.product.ProductRequest;
import com.example.backend_comic_service.develop.service.IProductService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
@Slf4j
@RestController
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    private IProductService productService;
    @Autowired
    private ResponseFactory responseFactory;
    @Autowired
    ObjectMapper objectMapper;

    @PostMapping(value = "/add-or-change", produces = "application/json;charset=UTF-8",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponseModel<ProductModel> addOrChange(@RequestPart("productModel") String productModel, @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        try {
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            byte[] bytes = productModel.getBytes(StandardCharsets.ISO_8859_1);
            String utf8String = new String(bytes, StandardCharsets.UTF_8);
            ProductRequest model = objectMapper.readValue(utf8String, ProductRequest.class);
            return productService.addOrChangeProduct(model, files);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @GetMapping("/delete")
    public BaseResponseModel<Integer> delete(@RequestParam(value = "id", required = false) Integer id,
                                             @RequestParam(value = "status", required = false) Integer status) {
        return productService.deleteProduct(id, status);
    }

    @GetMapping("/detail")
    public BaseResponseModel<ProductModel> detail(@RequestParam(value = "id", required = false) Integer id) {
        return productService.getProductById(id);
    }

    @GetMapping("/get-list-product")
    public BaseListResponseModel<List<ProductModel>> getListProduct(@RequestParam(value = "keySearch", required = false) String keySearch,
                                                                    @RequestParam(value = "categoryId", required = false) Integer categoryId,
                                                                    @RequestParam(value = "minPrice", required = false) Float minPrice,
                                                                    @RequestParam(value = "maxPrice", required = false) Float maxPrice,
                                                                    @RequestParam(value = "typeId", required = false) Integer typeId,
                                                                    @RequestParam(value = "status", required = false) Integer status,
                                                                    @RequestParam(value = "pageIndex") Integer pageIndex,
                                                                    @RequestParam(value = "pageSize") Integer pageSize) {
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize);
        return productService.getListProduct(categoryId, typeId, keySearch, status, minPrice, maxPrice, pageable);
    }

    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return productService.generateCode(0);
    }

    @PostMapping("/upload")
    public ResponseEntity<List<ExcelData>> uploadExcel(@RequestParam("file") MultipartFile file) throws IOException {
        log.info("Start upload : {}", LocalDateTime.now());
        productService.readExcelWithImages(file);
        return responseFactory.success(null);
    }

    @GetMapping("/selling-best")
    public BaseResponseModel<List<ProductModel>> getSellingBest() {
        return productService.getSellingBest();
    }

    @GetMapping("/running-out")
    public BaseResponseModel<List<ProductModel>> getRunningOut() {
        return productService.getRunningOut();
    }
}
