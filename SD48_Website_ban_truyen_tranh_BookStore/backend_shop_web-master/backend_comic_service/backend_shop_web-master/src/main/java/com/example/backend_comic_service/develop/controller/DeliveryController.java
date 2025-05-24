package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.entity.DeliveryEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DeliveryModel;
import com.example.backend_comic_service.develop.model.model.PaymentModel;
import com.example.backend_comic_service.develop.service.IDeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {
    @Autowired
    private IDeliveryService deliveryService;
    @GetMapping("/get-list") // Thêm dấu / ở đầu nếu là đường dẫn gốc của controller này
    public BaseListResponseModel<DeliveryModel> getList( // Sửa ở đây
                                                         @RequestParam(value = "keySearch", required = false) String keySearch,
                                                         @RequestParam(value = "status", required = false) Integer status,
                                                         @RequestParam(value = "pageIndex", defaultValue = "1") Integer pageIndex, // Thêm defaultValue và giả sử 1-based
                                                         @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) { // Thêm defaultValue
        // Giả sử pageIndex từ FE là 1-based, nên trừ 1 cho PageRequest (0-based)
        // Thêm Sort nếu cần, ví dụ: Sort.by("id").descending()
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize, Sort.by("id").descending());
        return deliveryService.getList(keySearch, status, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return deliveryService.generateCode();
    }
    @PostMapping("/add-or-change")
    public BaseResponseModel<DeliveryModel> addOrChange(@RequestBody DeliveryModel model) {
        return deliveryService.addOrChange(model);
    }
    @GetMapping("/delete")
    public BaseResponseModel<Integer> delete(@RequestParam(value = "id", required = false) Integer id,
                                             @RequestParam(value = "status", required = false) Integer status) {
        return deliveryService.delete(id, status);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<DeliveryModel> detail(@PathVariable Integer id) {
        return deliveryService.getById(id);
    }
}
