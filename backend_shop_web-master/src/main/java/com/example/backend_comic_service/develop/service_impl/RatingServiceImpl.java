package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.entity.RatingEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.RatingMapper;
import com.example.backend_comic_service.develop.model.model.RatingModel;
import com.example.backend_comic_service.develop.repository.ProductRepository;
import com.example.backend_comic_service.develop.repository.RatingRepository;
import com.example.backend_comic_service.develop.repository.UserRepository;
import com.example.backend_comic_service.develop.service.IRatingService;
import com.example.backend_comic_service.develop.validator.RatingValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class RatingServiceImpl implements IRatingService {

    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private RatingValidator ratingValidator;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public BaseResponseModel<Integer> addOrChange(RatingModel model) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            String errorMsg = ratingValidator.validate(model);
            if(StringUtils.hasText(errorMsg)){
                response.errorResponse(errorMsg);
                return response;
            }
            UserEntity user = userRepository.findUserEntitiesById(model.getUserId()).orElse(null);
            if(user == null){
                response.errorResponse("Người dùng không hợp lệ");
                return response;
            }
            ProductEntity productEntity = productRepository.findById(model.getProductId()).orElse(null);
            if(productEntity == null){
                response.errorResponse("Sản phẩm không hợp lệ");
                return response;
            }
            RatingEntity ratingEntity = model.toRatingEntity();
            ratingEntity.setProductEntity(productEntity);
            ratingEntity.setUserEntity(user);
            ratingEntity.setCreatedDate(LocalDateTime.now());

            RatingEntity savedRating = ratingRepository.save(ratingEntity);
            if(savedRating.getId() != null){
                response.successResponse(savedRating.getId(), "Thêm đánh giá thành công");
                return response;
            }
            response.errorResponse("Thêm dánh giá thất bại");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<RatingModel> getDetail(Integer id) {
        BaseResponseModel<RatingModel> response = new BaseResponseModel<>();
        try {
            if(id == null){
                response.errorResponse("Id không hợp lệ");
                return response;
            }
            RatingEntity ratingEntity = ratingRepository.findById(id).orElse(null);
            if(ratingEntity == null){
                response.errorResponse("Đánh giá không hợp lệ");
                return response;
            }
            response.successResponse(ratingEntity.toRatingModel(), "Thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<List<RatingMapper>> getListRating(Integer productId,  Integer startPoint, Integer endPoint, Pageable pageable) {
        BaseListResponseModel<List<RatingMapper>> response = new BaseListResponseModel<>();
        try {
            Page<RatingMapper> lMappers = ratingRepository.getListRates(productId,startPoint, endPoint, pageable);
            response.setTotalCount((int) lMappers.getTotalElements());
            response.successResponse(lMappers.getContent(), "Thành công");
            response.setPageIndex(pageable.getPageNumber());
            response.setPageSize(pageable.getPageSize());
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> delete(Integer id) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            if(id == null){
                response.errorResponse("Id không hợp lệ");
                return response;
            }
            RatingEntity ratingEntity = ratingRepository.findById(id).orElse(null);
            if(ratingEntity == null){
                response.errorResponse("Đánh giá không hợp lệ");
                return response;
            }
            ratingRepository.deleteById(id);
            response.successResponse(id, "Xóa đánh giá thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
