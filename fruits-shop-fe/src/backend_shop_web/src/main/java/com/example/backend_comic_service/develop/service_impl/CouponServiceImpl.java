package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.CouponEntity;
import com.example.backend_comic_service.develop.entity.DiscountEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CouponModel;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.repository.CouponRepository;
import com.example.backend_comic_service.develop.service.ICouponService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.CouponValidator;
import com.example.backend_comic_service.develop.validator.DiscountValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Date;
import java.util.List;

@Service
@Slf4j
public class CouponServiceImpl implements ICouponService {

    @Autowired
    private CouponRepository couponRepository;
    @Autowired
    private CouponValidator couponValidator;
    @Autowired
    private UtilService utilService;

    @Override
    public BaseResponseModel<CouponModel> addOrChange(CouponModel model) {
        BaseResponseModel<CouponModel> response = new BaseResponseModel<>();
        try{
            String errorMessage = couponValidator.validate(model);
            if(StringUtils.hasText(errorMessage)){
                response.errorResponse(errorMessage);
                return response;
            }
            CouponEntity couponEntity = couponRepository.saveAndFlush(model.toEntity());

            if(couponEntity.getId() != null){
                response.setData(model);
                response.successResponse(model, "Update successful");
                return response;
            }
            response.errorResponse("Add or change Coupon failed");
            return response;

        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<CouponModel> getCouponById(Integer id) {
        BaseResponseModel<CouponModel> response = new BaseResponseModel<>();
        try{
            CouponEntity couponEntity = couponRepository.findById(id).orElse(null);
            if(couponEntity == null){
                response.errorResponse("Coupon not found");
                return response;
            }
            CouponModel couponModel = couponEntity.toCouponModel();
            response.successResponse(couponModel, "Success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> delete(Integer id) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            CouponEntity couponEntity = couponRepository.findById(id).orElse(null);
            if(couponEntity == null){
                response.errorResponse("Coupon not found");
                return response;
            }
            couponRepository.updateDeleteCoupon(couponEntity.getId());
            response.successResponse(id, "Delete discount success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<List<CouponModel>> getListCoupon(Date startDate, Date endDate, Integer minValue, Integer maxValue, String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<List<CouponModel>> response = new BaseListResponseModel<>();
        try{
            Page<CouponEntity> entityList = couponRepository.getListCoupon(startDate, endDate, minValue, maxValue, keySearch, status, pageable);
            if(entityList == null){
                response.errorResponse("Coupon list is empty");
                return response;
            }
            List<CouponModel> couponModels = entityList.getContent().stream().map(CouponEntity::toCouponModel).toList();
            response.successResponse(couponModels, "Success");
            response.setTotalCount((int) entityList.getTotalElements());
            response.setPageSize(pageable.getPageSize());
            response.setPageIndex(pageable.getPageNumber());
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<String> generateCouponCode() {
        BaseResponseModel<String> response  = new BaseResponseModel<>();
        try{
            Integer idLastest =  couponRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("COU", idLastest);
            response.successResponse(codeGender, "Generate coupon code success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
