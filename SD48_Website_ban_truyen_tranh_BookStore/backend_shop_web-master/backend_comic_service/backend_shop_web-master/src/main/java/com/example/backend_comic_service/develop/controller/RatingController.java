package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.RatingMapper;
import com.example.backend_comic_service.develop.model.model.RatingModel;
import com.example.backend_comic_service.develop.service.IRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rating")
public class RatingController {
    @Autowired
    private IRatingService ratingService;

    @PostMapping("/add-or-change")
    public BaseResponseModel<Integer> addOrChange(@RequestBody RatingModel model) {
        return ratingService.addOrChange(model);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<RatingModel> getById(@PathVariable Integer id) {
        return ratingService.getDetail(id);
    }
    @DeleteMapping("/delete/{id}")
    public BaseResponseModel<Integer> delete(@PathVariable Integer id) {
        return ratingService.delete(id);
    }
    @GetMapping("/get-list-rating")
    public BaseListResponseModel<RatingMapper> getListRating( // Sửa ở đây, và đổi tên phương thức cho nhất quán
                                                              @RequestParam(value = "productId", required = false) Integer productId, // Đổi tên tham số cho khớp với service
                                                              @RequestParam(value = "startPoint", required = false) Integer startPoint, // Đổi tên tham số cho khớp với service
                                                              @RequestParam(value = "endPoint", required = false) Integer endPoint,   // Đổi tên tham số cho khớp với service
                                                              @RequestParam(value = "pageIndex", defaultValue = "1") Integer pageIndex,  // Giả sử 1-based từ FE
                                                              @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        // Giả sử pageIndex từ FE là 1-based, nên trừ 1 cho PageRequest (0-based)
        // Thêm Sort nếu cần, ví dụ: Sort.by("ratingDate").descending()
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize, Sort.by("id").descending()); // Ví dụ sort by id
        return ratingService.getListRating(productId, startPoint, endPoint, pageable);
    }
}
