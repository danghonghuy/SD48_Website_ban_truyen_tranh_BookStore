package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
// import com.example.backend_comic_service.develop.model.model.DiscountModel; // Không dùng ở đây
import com.example.backend_comic_service.develop.model.model.TypeModel;
import com.example.backend_comic_service.develop.service.ITypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

// import java.sql.Date; // Không dùng ở đây
// import java.util.List; // Không dùng trực tiếp ở đây

@RestController
@RequestMapping("/api/types")
public class TypeController {

    @Autowired
    private ITypeService typeService;

    @PostMapping("/add-or-change")
    public BaseResponseModel<TypeModel> addOrChange(@RequestBody TypeModel model) {
        return typeService.addOrChange(model);
    }
    @GetMapping("/delete")
    public BaseResponseModel<Integer> delete(@RequestParam(value = "id", required = false)Integer id, @RequestParam(value = "status", required = false)Integer status) {
        return typeService.delete(id,status);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<TypeModel> detail(@PathVariable Integer id) {
        return typeService.getTypeById(id);
    }
    @GetMapping("/get-list-type")
    public BaseListResponseModel<TypeModel> getListTypes(
            @RequestParam(value = "keySearch", required = false) String keySearch,
            @RequestParam(value = "status", required = false) Integer status,
            @RequestParam(value = "pageIndex", defaultValue = "1") Integer pageIndex,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {

        // Đảm bảo pageIndex không bao giờ dẫn đến giá trị âm cho PageRequest
        int actualPageIndex = (pageIndex == null || pageIndex <= 0) ? 0 : pageIndex - 1;
        // Nếu pageIndex từ client là 1 (hoặc không truyền, dùng default), actualPageIndex sẽ là 0.
        // Nếu pageIndex từ client là 0 hoặc âm, actualPageIndex cũng sẽ là 0 (trang đầu tiên).

        Pageable pageable = PageRequest.of(actualPageIndex, pageSize, Sort.by("id").descending());
        return typeService.getListTypes(keySearch, status, pageable);
    }
    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return typeService.generaTypeCode();
    }
}