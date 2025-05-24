package com.example.backend_comic_service.develop.controller; // Đảm bảo package đúng

import com.example.backend_comic_service.develop.model.model.AuthorModel;
import com.example.backend_comic_service.develop.service.IAuthorService;
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
@RequestMapping("/api/authors")

public class AuthorController {

    private final IAuthorService authorService;

    @Autowired
    public AuthorController(IAuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public ResponseEntity<?> getAllAuthors(
            @RequestParam(defaultValue = "0") int pageIndex,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "") String keySearch,
            @RequestParam(defaultValue = "id,asc") String[] sort) {
        try {
            String sortField = sort[0];
            Sort.Direction sortDirection = sort.length > 1 && sort[1].equalsIgnoreCase("desc") ?
                    Sort.Direction.DESC : Sort.Direction.ASC;

            // Mặc định sắp xếp theo createdDate giảm dần nếu không có sort field cụ thể từ client
            // hoặc nếu client chỉ gửi sort direction mà không gửi field.
            if (sortField == null || sortField.trim().isEmpty() || sortField.equalsIgnoreCase("asc") || sortField.equalsIgnoreCase("desc")) {
                sortField = "createdDate"; // Sắp xếp theo ngày tạo mới nhất lên đầu
                sortDirection = Sort.Direction.DESC;
            }

            Pageable pageable = PageRequest.of(pageIndex, pageSize, Sort.by(sortDirection, sortField));
            Page<AuthorModel> authorPage = authorService.getAllAuthors(keySearch, pageable);

            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", authorPage.getContent());
            data.put("totalCount", authorPage.getTotalElements());
            // Các thông tin phân trang khác nếu frontend cần
            // data.put("totalPages", authorPage.getTotalPages());
            // data.put("pageIndex", authorPage.getNumber());
            // data.put("pageSize", authorPage.getSize());

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Lấy danh sách tác giả thành công.");

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy danh sách tác giả: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAuthorById(@PathVariable Integer id) {
        try {
            AuthorModel author = authorService.getAuthorById(id);
            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", author); // Trả về object tác giả trực tiếp trong data.data

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Lấy thông tin tác giả thành công.");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) { // ResourceNotFoundException sẽ được xử lý bởi @ResponseStatus
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            // HttpStatus sẽ được xác định bởi @ResponseStatus trên Exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<?> createAuthor(@RequestBody AuthorModel authorModel) {
        try {
            AuthorModel createdAuthor = authorService.createAuthor(authorModel);
            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", createdAuthor);

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Thêm tác giả thành công!");
            return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
        } catch (Exception e) { // DuplicateRecordException sẽ được xử lý bởi @ResponseStatus
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAuthor(@PathVariable Integer id, @RequestBody AuthorModel authorModel) {
        try {
            AuthorModel updatedAuthor = authorService.updateAuthor(id, authorModel);
            Map<String, Object> responseBody = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("data", updatedAuthor);

            responseBody.put("data", data);
            responseBody.put("success", true);
            responseBody.put("message", "Cập nhật tác giả thành công!");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAuthor(@PathVariable Integer id) {
        try {
            authorService.deleteAuthor(id);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("success", true);
            responseBody.put("message", "Xóa tác giả thành công!");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}