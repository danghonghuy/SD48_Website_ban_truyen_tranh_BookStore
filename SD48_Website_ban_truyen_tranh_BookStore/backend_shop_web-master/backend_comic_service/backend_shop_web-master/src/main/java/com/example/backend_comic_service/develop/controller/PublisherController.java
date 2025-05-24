package com.example.backend_comic_service.develop.controller; // Đảm bảo package đúng

import com.example.backend_comic_service.develop.model.model.PublisherModel;
import com.example.backend_comic_service.develop.service.IPublisherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/publishers")

public class PublisherController {

    private final IPublisherService publisherService;

    @Autowired
    public PublisherController(IPublisherService publisherService) {
        this.publisherService = publisherService;
    }

    @GetMapping
    public ResponseEntity<?> getAllPublishers(
            @RequestParam(defaultValue = "0") int pageIndex,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "") String keySearch,
            @RequestParam(defaultValue = "id,asc") String[] sort) {
        try {
            String sortField = sort[0];
            Sort.Direction sortDirection = sort.length > 1 && sort[1].equalsIgnoreCase("desc") ?
                    Sort.Direction.DESC : Sort.Direction.ASC;

            if (sortField == null || sortField.trim().isEmpty() || sortField.equalsIgnoreCase("asc") || sortField.equalsIgnoreCase("desc")) {
                sortField = "createdDate";
                sortDirection = Sort.Direction.DESC;
            }

            Pageable pageable = PageRequest.of(pageIndex, pageSize, Sort.by(sortDirection, sortField));
            Page<PublisherModel> publisherPage = publisherService.getAllPublishers(keySearch, pageable);

            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", publisherPage.getContent());
            data.put("totalCount", publisherPage.getTotalElements());

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Lấy danh sách nhà xuất bản thành công.");

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy danh sách nhà xuất bản: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPublisherById(@PathVariable Integer id) {
        try {
            PublisherModel publisher = publisherService.getPublisherById(id);
            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", publisher);

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Lấy thông tin nhà xuất bản thành công.");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<?> createPublisher(@RequestBody PublisherModel publisherModel) {
        try {
            PublisherModel createdPublisher = publisherService.createPublisher(publisherModel);
            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", createdPublisher);

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Thêm nhà xuất bản thành công!");
            return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePublisher(@PathVariable Integer id, @RequestBody PublisherModel publisherModel) {
        try {
            PublisherModel updatedPublisher = publisherService.updatePublisher(id, publisherModel);
            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", updatedPublisher);

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Cập nhật nhà xuất bản thành công!");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePublisher(@PathVariable Integer id) {
        try {
            publisherService.deletePublisher(id);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("success", true);
            responseBody.put("message", "Xóa nhà xuất bản thành công!");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}