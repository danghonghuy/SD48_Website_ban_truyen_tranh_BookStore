package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.PaymentModel;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.service.IPaymentService;
import com.example.backend_comic_service.develop.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private IPaymentService paymentService;

    @PostMapping("/add-or-change")
    public BaseResponseModel<PaymentModel> addOrChange(@RequestBody PaymentModel model) {
        return paymentService.addOrChange(model);
    }

    @GetMapping("/delete")
    public BaseResponseModel<Integer> delete(@RequestParam(value = "id", required = false) Integer id, @RequestParam(value = "status") Integer status) {
        return paymentService.delete(id, status);
    }

    @GetMapping("/detail/{id}")
    public BaseResponseModel<PaymentModel> detail(@PathVariable Integer id) {
        return paymentService.getPaymentById(id);
    }

    @GetMapping("/get-list-payment")
    public BaseListResponseModel<PaymentModel> getList( // Sửa ở đây
                                                        @RequestParam(value = "keySearch", required = false) String keySearch,
                                                        @RequestParam(value = "status", required = false) Integer status,
                                                        @RequestParam(value = "pageIndex", defaultValue = "1") Integer pageIndex, // Thêm defaultValue và giả sử 1-based
                                                        @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) { // Thêm defaultValue
        // Giả sử pageIndex từ FE là 1-based, nên trừ 1 cho PageRequest (0-based)
        // Thêm Sort nếu cần, ví dụ: Sort.by("id").descending()
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize, Sort.by("id").descending());
        return paymentService.getAllPayments(keySearch, status, pageable);
    }

    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return paymentService.generateCode();
    }

    @GetMapping("/get-url-payment")
    public BaseResponseModel<String> getUrlPayment(
            @RequestParam(value = "orderId") String orderId,
            @RequestParam(value = "amount") BigDecimal amount
    ) {
        return paymentService.payWithMomo(orderId, amount);
    }

}
