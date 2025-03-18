package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.service.IDiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/discount")
public class DiscountController {

    @Autowired
    private IDiscountService discountService;

    @PostMapping("/add-or-change")
    public BaseResponseModel<DiscountModel> addOrChange(@RequestBody DiscountModel discountModel) {
        return discountService.addOrChange(discountModel);
    }
    @DeleteMapping("/delete/{id}")
    public BaseResponseModel<Integer> delete(@PathVariable Integer id) {
        return discountService.delete(id);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<DiscountModel> detail(@PathVariable Integer id) {
        return discountService.getDiscountById(id);
    }
    @GetMapping("/get-list-discount")
    public BaseListResponseModel<List<DiscountModel>> getListDiscount(@RequestParam(value = "startDate", required = false)Date startDate,
                                                                      @RequestParam(value = "endDate", required = false)Date endDate,
                                                                      @RequestParam(value = "minValue", required = false) Integer minValue,
                                                                      @RequestParam(value = "maxValue", required = false) Integer maxValue,
                                                                      @RequestParam(value = "keySearch", required = false) String keySearch,
                                                                      @RequestParam(value = "status", required = false) Integer status,
                                                                      @RequestParam(value = "pageIndex") Integer pageIndex,
                                                                      @RequestParam(value = "pageSize") Integer pageSize) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        return discountService.getListDiscount(startDate, endDate, minValue, maxValue, keySearch, status, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return discountService.generateDiscountCode();
    }

}
