package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.enums.StatusFeeEnum;
import com.example.backend_comic_service.develop.exception.ResponseFactory;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.dto.ShippingFeeDTO;
import com.example.backend_comic_service.develop.model.request.shipping_fee.ShippingFeeModel;
import com.example.backend_comic_service.develop.model.request.shipping_fee.ShippingFeeUpdate;
import com.example.backend_comic_service.develop.service.ShippingFeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/shipping-fee")
public class ShippingFeeController {

    @Autowired
    private ShippingFeeService shippingFeeService;

    @Autowired
    private ResponseFactory responseFactory;

    @PostMapping()
    public ResponseEntity create(@RequestBody @Valid ShippingFeeModel model) {
        return responseFactory.success(shippingFeeService.create(model));
    }

    @GetMapping("/getFee")
    public ResponseEntity getFee(@RequestParam(value = "pointSource", required = true) String pointSource,
                                 @RequestParam(value = "pointDestination", required = true) String pointDestination) {
        return responseFactory.success(shippingFeeService.getFee(pointSource, pointDestination));
    }

    @PutMapping("/{feeId}")
    public ResponseEntity update(@PathVariable Long feeId,@RequestBody ShippingFeeUpdate model) throws Exception {
        return responseFactory.success(shippingFeeService.update(feeId, model));
    }

    @GetMapping("/{feeId}/detail")
    public ResponseEntity detail(@PathVariable Long feeId){
        return responseFactory.success(shippingFeeService.detail(feeId));
    }

    @GetMapping()
    public BaseListResponseModel<List<ShippingFeeDTO>> getListCategory(@RequestParam(value = "keySearch", required = false) String keySearch,
                                                                      @RequestParam(value = "status", required = false) StatusFeeEnum status,
                                                                      @RequestParam(value = "pageIndex", defaultValue = "0") Integer pageIndex,
                                                                      @RequestParam(value = "pageSize",  defaultValue = "10") Integer pageSize){
        Pageable pageable =  PageRequest.of(pageIndex - 1, pageSize);
        return  shippingFeeService.getPage(keySearch, status, pageable);
    }
}
