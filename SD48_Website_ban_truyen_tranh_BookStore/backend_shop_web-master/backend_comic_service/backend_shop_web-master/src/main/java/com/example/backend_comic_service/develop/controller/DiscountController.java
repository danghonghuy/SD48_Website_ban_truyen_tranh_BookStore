package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.model.request.DiscountRequest;
import com.example.backend_comic_service.develop.service.IDiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/discount")
public class DiscountController {

    @Autowired
    private IDiscountService discountService;

    @PostMapping("/add-or-change")
    public BaseResponseModel<DiscountModel> addOrChange(@RequestBody DiscountRequest discountModel) {
        return discountService.addOrChange(discountModel);
    }

    @GetMapping("/delete")
    public BaseResponseModel<Integer> delete(@RequestParam(value = "id", required = false) Integer id, @RequestParam(value = "status", required = false) Integer status) {
        return discountService.delete(id, status);
    }

    @GetMapping("/detail/{id}")
    public BaseResponseModel<DiscountModel> detail(@PathVariable Integer id) {
        return discountService.getDiscountById(id);
    }

    @GetMapping("/get-list-discount")
    public BaseListResponseModel<DiscountModel> getListDiscount( // Sửa ở đây
                                                                 @RequestParam(value = "startDate", required = false) LocalDateTime startDate,
                                                                 @RequestParam(value = "endDate", required = false) LocalDateTime endDate,
                                                                 @RequestParam(value = "minValue", required = false) Integer minValue, // Thêm minValue nếu cần lọc theo giá trị
                                                                 @RequestParam(value = "maxValue", required = false) Integer maxValue, // Thêm maxValue nếu cần lọc theo giá trị
                                                                 @RequestParam(value = "keySearch", required = false) String keySearch,
                                                                 @RequestParam(value = "status", required = false) Integer status,
                                                                 @RequestParam(value = "pageIndex", defaultValue = "1") Integer pageIndex, // Thêm defaultValue và giả sử 1-based
                                                                 @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) { // Thêm defaultValue
        // Giả sử pageIndex từ FE là 1-based, nên trừ 1 cho PageRequest (0-based)
        // Thêm Sort nếu cần, ví dụ: Sort.by("id").descending()
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize, Sort.by("id").descending());
        // Truyền minValue và maxValue vào service
        return discountService.getListDiscount(startDate, endDate, minValue, maxValue, keySearch, status, pageable);
    }

    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return discountService.generateDiscountCode();
    }
}
