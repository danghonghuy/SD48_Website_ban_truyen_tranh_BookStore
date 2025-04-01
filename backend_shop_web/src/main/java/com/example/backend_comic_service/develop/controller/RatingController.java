package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.RatingMapper;
import com.example.backend_comic_service.develop.model.model.RatingModel;
import com.example.backend_comic_service.develop.service.IRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public BaseListResponseModel<List<RatingMapper>> getListRole(@RequestParam( value = "productIds",required = false) Integer productIds,
                                                                 @RequestParam(value = "startRate", required = false) Integer startRate,
                                                                 @RequestParam(value = "endRate", required = false) Integer endRate,
                                                                 @RequestParam(value = "pageIndex", required = true, defaultValue = "0") Integer pageIndex,
                                                                 @RequestParam(value = "pageSize", required = true, defaultValue = "10") Integer pageSize) {
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        return ratingService.getListRating(productIds, startRate, endRate , pageable);
    }
}
