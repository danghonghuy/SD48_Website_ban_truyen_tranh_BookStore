package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.constants.CouponTypeEnum;
import com.example.backend_comic_service.develop.entity.CouponEntity;
import com.example.backend_comic_service.develop.entity.DiscountEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CouponModel;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.repository.CouponRepository;
import com.example.backend_comic_service.develop.service.ICouponService;
import com.example.backend_comic_service.develop.utils.AuthenticationService;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    @Autowired
    private AuthenticationService authenticationService;

    @Override
    public BaseResponseModel<CouponModel> addOrChange(CouponModel model) {
        BaseResponseModel<CouponModel> response = new BaseResponseModel<>();
        try{
            String errorMessage = couponValidator.validate(model);
            if(StringUtils.hasText(errorMessage)){
                response.errorResponse(errorMessage);
                return response;
            }

            UserEntity userEntity = authenticationService.authenToken();
            if(userEntity == null){
                response.errorResponse("Authentication Failed");
                return response;
            }
            CouponEntity modelEntity = new CouponEntity();
            if(model.getId() != null){
                modelEntity = couponRepository.findById(model.getId()).orElse(null);
                if(modelEntity == null){
                    response.errorResponse("Coupon Not Found");
                    return response;
                }
                modelEntity.setCouponAmount(model.getCouponAmount());
                modelEntity.setQuantity(model.getQuantity());
                modelEntity.setDateStart(model.getDateStart());
                modelEntity.setDateEnd(model.getDateEnd());
                modelEntity.setMaxValue(model.getMaxValue());
                modelEntity.setMinValue(model.getMinValue());
                modelEntity.setDescription(model.getDescription());
                modelEntity.setType(model.getType());
            }else{
                modelEntity = model.toEntity();
                modelEntity.setCreatedBy(userEntity.getId());
                modelEntity.setCreatedDate(Date.valueOf(LocalDate.now()));
            }
            modelEntity.setUpdated_by(userEntity.getId());
            modelEntity.setUpdatedDate(Date.valueOf(LocalDate.now()));
            CouponEntity couponEntity = couponRepository.saveAndFlush(modelEntity);
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
    public BaseResponseModel<Integer> delete(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            CouponEntity couponEntity = couponRepository.findById(id).orElse(null);
            if(couponEntity == null){
                response.errorResponse("Coupon not found");
                return response;
            }
            couponRepository.updateDeleteCoupon(couponEntity.getId(), status);
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
            String patternStr = utilService.generateStringFromRegex();
            String codeGender = utilService.getGenderCode(patternStr, idLastest);
            response.successResponse(codeGender, "Generate coupon code success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Double> useCoupon(String couponCode, Double sumPrice) {
        BaseResponseModel<Double> response  = new BaseResponseModel<>();
        try{
            if (StringUtils.hasText(couponCode)) {
                CouponEntity couponEntity = couponRepository.findByCode(couponCode).orElse(null);
                if (couponEntity == null) {
                    response.errorResponse("Coupon code is invalid");
                    return response;
                }
                if (couponEntity.getDateStart().isAfter(LocalDateTime.now())) {
                    response.errorResponse("Coupon code is not still open to use");
                    return response;
                }
                if (couponEntity.getDateEnd().isBefore(LocalDateTime.now())) {
                    response.errorResponse("Coupon code is expire date to use");
                    return response;
                }
                if (couponEntity.getQuantityUsed() > couponEntity.getQuantity()) {
                    response.errorResponse("Coupon is already used");
                    return response;
                }
                if (!(sumPrice >= couponEntity.getMinValue() && sumPrice <= couponEntity.getMaxValue())) {
                    response.errorResponse("Value of order not satisfy the condition to use coupon");
                    return response;
                }

                if (couponEntity.getType().equals(CouponTypeEnum.COUPON_PERCENT)) {
                    sumPrice = (sumPrice * ((double) couponEntity.getCouponAmount() / 100));
                }
                else {
                    sumPrice = Double.valueOf(couponEntity.getCouponAmount());
                }
                response.successResponse(sumPrice, "Success");
                return  response;
            }
            response.errorResponse("Coupon code is null");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
