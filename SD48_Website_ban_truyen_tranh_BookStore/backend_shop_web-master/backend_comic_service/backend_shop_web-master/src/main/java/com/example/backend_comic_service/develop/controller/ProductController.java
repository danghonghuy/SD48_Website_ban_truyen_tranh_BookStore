package com.example.backend_comic_service.develop.controller;

// import com.example.backend_comic_service.develop.exception.ResponseFactory; // Không còn sử dụng nếu uploadExcel trả về ExcelImportResult
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.excel.ExcelImportResult; // THÊM IMPORT NÀY
import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.model.request.product.ProductRequest;
import com.example.backend_comic_service.develop.service.IProductService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus; // THÊM IMPORT NÀY
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    private IProductService productService;
    // @Autowired
    // private ResponseFactory responseFactory; // Không cần nếu uploadExcel trả về ExcelImportResult
    @Autowired
    ObjectMapper objectMapper;

    @PostMapping(value = "/add-or-change", produces = "application/json;charset=UTF-8", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponseModel<ProductModel> addOrChange(
            @RequestPart("productData") String productRequestString,
            @RequestPart(value = "ListFileImg", required = false) List<MultipartFile> files
    ) {
        System.out.println("CONTROLLER DEBUG: === Bắt đầu addOrChange Controller ===");
        System.out.println("CONTROLLER DEBUG: productRequestString nhận được: " + productRequestString);
        if (files == null) {
            System.out.println("CONTROLLER DEBUG: List<MultipartFile> files là NULL");
        } else {
            System.out.println("CONTROLLER DEBUG: Số lượng file nhận được trong Controller: " + files.size());
            for (int i = 0; i < files.size(); i++) {
                MultipartFile f = files.get(i);
                if (f == null) {
                    System.out.println("CONTROLLER DEBUG: File thứ " + (i + 1) + " (trong Controller) là NULL");
                } else {
                    System.out.println("CONTROLLER DEBUG: File thứ " + (i + 1) + " (trong Controller): Name=" + f.getOriginalFilename() + ", Size=" + f.getSize() + ", isEmpty=" + f.isEmpty());
                }
            }
        }

        try {
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            ProductRequest model = objectMapper.readValue(productRequestString, ProductRequest.class);
            System.out.println("CONTROLLER DEBUG: Đã parse ProductRequest: ID=" + model.getId() + ", Name=" + model.getName());

            System.out.println("CONTROLLER DEBUG: Gọi productService.addOrChangeProduct...");
            BaseResponseModel<ProductModel> serviceResponse = productService.addOrChangeProduct(model, files);
            System.out.println("CONTROLLER DEBUG: === Kết thúc addOrChange Controller (Thành công gọi service) ===");
            return serviceResponse;
        } catch (JsonProcessingException e) {
            log.error("CONTROLLER ERROR: JsonProcessingException khi parse ProductRequest: {}", e.getMessage(), e);
            System.out.println("CONTROLLER DEBUG: === Kết thúc addOrChange Controller (Lỗi JsonProcessingException) ===");
            BaseResponseModel<ProductModel> errorResponse = new BaseResponseModel<>();
            errorResponse.errorResponse("Lỗi xử lý dữ liệu sản phẩm: " + e.getMessage());
            return errorResponse;
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
    public BaseListResponseModel<ProductModel> getListProduct( // Sửa ở đây
                                                               @RequestParam(value = "keySearch", required = false) String keySearch,
                                                               @RequestParam(value = "categoryId", required = false) Integer categoryId,
                                                               @RequestParam(value = "minPrice", required = false) Float minPrice,
                                                               @RequestParam(value = "maxPrice", required = false) Float maxPrice,
                                                               @RequestParam(value = "typeId", required = false) Integer typeId,
                                                               @RequestParam(value = "status", required = false) Integer status,
                                                               @RequestParam(value = "pageIndex", defaultValue = "1") Integer pageIndex, // Thêm defaultValue và giả sử 1-based
                                                               @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) { // Thêm defaultValue
        // Giả sử pageIndex từ FE là 1-based, nên trừ 1 cho PageRequest (0-based)
        // Thêm Sort nếu cần, ví dụ: Sort.by("id").descending()
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize, Sort.by("id").descending());
        return productService.getListProduct(categoryId, typeId, keySearch, status, minPrice, maxPrice, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return productService.generateCode(0);
    }

    // SỬA ENDPOINT NÀY ĐỂ TRẢ VỀ ExcelImportResult
    @PostMapping("/upload")
    public ResponseEntity<ExcelImportResult> uploadExcel(@RequestParam("file") MultipartFile file) {
        log.info("Bắt đầu upload Excel: {}", LocalDateTime.now());
        if (file.isEmpty()) {
            log.warn("File Excel upload rỗng.");
            // Trả về lỗi Bad Request nếu file rỗng
            ExcelImportResult emptyFileResult = new ExcelImportResult(0,0,0,
                    List.of(new com.example.backend_comic_service.develop.model.excel.ExcelRowError(0, "", List.of("File Excel không được để trống."))));
            return ResponseEntity.badRequest().body(emptyFileResult);
        }
        try {
            ExcelImportResult result = productService.readExcelWithImages(file);
            log.info("Xử lý upload Excel hoàn tất. Thành công: {}, Thất bại: {}", result.getSuccessfullyImportedCount(), result.getFailedImportCount());
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            log.error("Lỗi IOException khi upload và xử lý Excel: {}", e.getMessage(), e);
            ExcelImportResult errorResult = new ExcelImportResult(0,0,0,
                    List.of(new com.example.backend_comic_service.develop.model.excel.ExcelRowError(0, "", List.of("Lỗi khi đọc hoặc xử lý file Excel: " + e.getMessage()))));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResult);
        } catch (Exception e) {
            log.error("Lỗi không xác định khi upload Excel: {}", e.getMessage(), e);
            ExcelImportResult errorResult = new ExcelImportResult(0,0,0,
                    List.of(new com.example.backend_comic_service.develop.model.excel.ExcelRowError(0, "", List.of("Lỗi không mong muốn trên server: " + e.getMessage()))));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResult);
        }
    }

    @GetMapping("/selling-best")
    public BaseResponseModel<List<ProductModel>> getSellingBest() {
        return productService.getSellingBest();
    }

    @GetMapping("/running-out")
    public BaseResponseModel<List<ProductModel>> getRunningOut() {
        return productService.getRunningOut();
    }

    @GetMapping("/export-excel")
    public ResponseEntity<Resource> exportProductsToExcel(
            @RequestParam(value = "keySearch", required = false) String keySearch,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "minPrice", required = false) Float minPrice,
            @RequestParam(value = "maxPrice", required = false) Float maxPrice,
            @RequestParam(value = "typeId", required = false) Integer typeId,
            @RequestParam(value = "status", required = false) Integer status
    ) {
        log.info("Controller: Yêu cầu xuất Excel (ResponseEntity<Resource>) cho sản phẩm với các filter: keySearch={}, categoryId={}, minPrice={}, maxPrice={}, typeId={}, status={}",
                keySearch, categoryId, minPrice, maxPrice, typeId, status);
        try {
            byte[] excelData = productService.exportProductsToExcel(keySearch, categoryId, minPrice, maxPrice, typeId, status);

            if (excelData == null || excelData.length == 0) {
                log.warn("Controller: Dữ liệu Excel trả về từ service là rỗng hoặc null.");
                return ResponseEntity.noContent().build();
            }

            ByteArrayResource resource = new ByteArrayResource(excelData);
            String fileName = "Danh_sach_san_pham_" + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
            headers.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
            headers.add(HttpHeaders.PRAGMA, "no-cache");
            headers.add(HttpHeaders.EXPIRES, "0");

            log.info("Controller: Chuẩn bị gửi file Excel '{}' với kích thước {} bytes.", fileName, excelData.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(excelData.length)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(resource);

        } catch (IOException e) {
            log.error("Controller: Lỗi IOException khi gọi service xuất Excel: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (Exception e) {
            log.error("Controller: Lỗi không mong muốn khi xuất Excel: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}