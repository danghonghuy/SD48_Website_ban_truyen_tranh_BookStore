package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.RatingMapper;
import com.example.backend_comic_service.develop.model.model.RatingModel;
import org.springframework.data.domain.Pageable;

// import java.util.List; // Không cần cho getListRating nếu đã sửa

public interface IRatingService {

    BaseResponseModel<Integer> addOrChange(RatingModel model);
    BaseResponseModel<RatingModel> getDetail(Integer id);
    BaseListResponseModel<RatingMapper> getListRating( // Sửa ở đây
                                                       Integer productId, Integer startPoint, Integer endPoint, Pageable pageable
    );
    BaseResponseModel<Integer> delete(Integer id);
}