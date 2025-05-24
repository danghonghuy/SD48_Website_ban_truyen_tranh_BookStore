package com.example.backend_comic_service.develop.controller; // Đảm bảo package đúng

import com.example.backend_comic_service.develop.model.model.DistributorModel;
import com.example.backend_comic_service.develop.service.IDistributorService;
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
@RequestMapping("/api/distributors")

public class DistributorController {

    private final IDistributorService distributorService;

    @Autowired
    public DistributorController(IDistributorService distributorService) {
        this.distributorService = distributorService;
    }

    @GetMapping
    public ResponseEntity<?> getAllDistributors(
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
            Page<DistributorModel> distributorPage = distributorService.getAllDistributors(keySearch, pageable);

            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", distributorPage.getContent());
            data.put("totalCount", distributorPage.getTotalElements());

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Lấy danh sách nhà phát hành thành công.");

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy danh sách nhà phát hành: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDistributorById(@PathVariable Integer id) {
        try {
            DistributorModel distributor = distributorService.getDistributorById(id);
            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", distributor);

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Lấy thông tin nhà phát hành thành công.");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<?> createDistributor(@RequestBody DistributorModel distributorModel) {
        try {
            DistributorModel createdDistributor = distributorService.createDistributor(distributorModel);
            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", createdDistributor);

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Thêm nhà phát hành thành công!");
            return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDistributor(@PathVariable Integer id, @RequestBody DistributorModel distributorModel) {
        try {
            DistributorModel updatedDistributor = distributorService.updateDistributor(id, distributorModel);
            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", updatedDistributor);

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Cập nhật nhà phát hành thành công!");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDistributor(@PathVariable Integer id) {
        try {
            distributorService.deleteDistributor(id);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("success", true);
            responseBody.put("message", "Xóa nhà phát hành thành công!");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}