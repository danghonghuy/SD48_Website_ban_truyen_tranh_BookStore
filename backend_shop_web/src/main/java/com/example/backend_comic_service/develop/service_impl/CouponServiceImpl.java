package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.configs.configs_sercurity_service.LocalDateTimeDeserializer;
import com.example.backend_comic_service.develop.constants.CouponTypeEnum;
import com.example.backend_comic_service.develop.entity.CouponEntity;
import com.example.backend_comic_service.develop.entity.DiscountEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CouponModel;
import com.example.backend_comic_service.develop.model.model.CouponRequest;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.model.request.DiscountRequest;
import com.example.backend_comic_service.develop.repository.CouponRepository;
import com.example.backend_comic_service.develop.service.ICouponService;
import com.example.backend_comic_service.develop.utils.AuthenticationService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.CouponValidator;
import com.example.backend_comic_service.develop.validator.DiscountValidator;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
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
    public BaseResponseModel<CouponModel> addOrChange(CouponRequest model) {
        BaseResponseModel<CouponModel> response = new BaseResponseModel<>();
        try {
            String errorMessage = "";//couponValidator.validate(model);
            if (StringUtils.hasText(errorMessage)) {
                response.errorResponse(errorMessage);
                return response;
            }

            UserEntity userEntity = authenticationService.authenToken();
            if (userEntity == null) {
                response.errorResponse("Xác thực người dùng không thành công");
                return response;
            }
            CouponEntity modelEntity = new CouponEntity();
            if (model.getId() != null) {
                modelEntity = couponRepository.findById(model.getId()).orElse(null);
                if (modelEntity == null) {
                    response.errorResponse("Không tìm thấy phiếu giảm giá");
                    return response;
                }
                modelEntity.setCouponAmount(model.getCouponAmount());
                modelEntity.setQuantity(model.getQuantity());
                modelEntity.setDateStart(model.getDateStart());
                modelEntity.setDateEnd(model.getDateEnd());
                modelEntity.setMaxValue(model.getMaxValue());
                modelEntity.setMinValue(model.getMinValue());
                modelEntity.setPercentValue(model.getPercentValue());
                modelEntity.setDescription(model.getDescription());
                modelEntity.setType(model.getType());
            } else {
                modelEntity = model.toEntity();
                modelEntity.setCreatedBy(userEntity.getId());
                modelEntity.setCreatedDate(LocalDateTime.now());
            }
            modelEntity.setStatus(this.getStatus(model));
            modelEntity.setUpdated_by(userEntity.getId());
            modelEntity.setUpdatedDate(LocalDateTime.now());
            CouponEntity couponEntity = couponRepository.saveAndFlush(modelEntity);
            if (couponEntity.getId() != null) {
                response.setData(couponEntity.toCouponModel());
                response.successResponse(couponEntity.toCouponModel(), "Cập nhật thành công");
                return response;
            }
            response.errorResponse("Thêm phiếu giảm giá thất bại");
            return response;

        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    private Integer getStatus(CouponRequest model) {
        LocalDateTime dateStart = model.getDateStart();
        LocalDateTime dateEnd = model.getDateEnd();
        Integer status = 2;
        log.info("dateStart: {} - dateEnd: {}", dateStart, dateEnd);
        if (dateStart.isAfter(LocalDateTime.now()) && dateEnd.isAfter(LocalDateTime.now())) {
            status = 2;
        } else if (dateStart.isBefore(LocalDateTime.now()) && dateEnd.isBefore(LocalDateTime.now())) {
            status = 0;
        } else if (dateStart.isBefore(LocalDateTime.now()) && dateEnd.isAfter(LocalDateTime.now())) {
            status = 1;
        }
        return status;
    }

    @Override
    public BaseResponseModel<CouponModel> getCouponById(Integer id) {
        BaseResponseModel<CouponModel> response = new BaseResponseModel<>();
        try {
            CouponEntity couponEntity = couponRepository.findById(id).orElse(null);
            if (couponEntity == null) {
                response.errorResponse("Không tìm thấy phiếu giảm giá");
                return response;
            }
            CouponModel couponModel = couponEntity.toCouponModel();
            response.successResponse(couponModel, "Thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> delete(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            CouponEntity couponEntity = couponRepository.findById(id).orElse(null);
            if (couponEntity == null) {
                response.errorResponse("Không tìm thấy phiếu giảm giá");
                return response;
            }
            couponRepository.updateDeleteCoupon(couponEntity.getId(), status);
            response.successResponse(id, "Xóa phiếu giảm giá thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<List<CouponModel>> getListCoupon(LocalDateTime startDate, LocalDateTime endDate, Integer minValue, Integer maxValue, String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<List<CouponModel>> response = new BaseListResponseModel<>();
        try {
            Page<CouponEntity> entityList = couponRepository.getListCoupon(startDate, endDate, minValue, maxValue, keySearch, status, pageable);
            if (entityList == null) {
                response.errorResponse("Danh sách phiếu giảm giá trống");
                return response;
            }
            List<CouponModel> couponModels = entityList.getContent().stream().map(CouponEntity::toCouponModel).toList();
            response.successResponse(couponModels, "Thành công");
            response.setTotalCount((int) entityList.getTotalElements());
            response.setPageSize(pageable.getPageSize());
            response.setPageIndex(pageable.getPageNumber());
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<String> generateCouponCode() {
        BaseResponseModel<String> response = new BaseResponseModel<>();
        try {
            Integer idLastest = couponRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String patternStr = utilService.generateStringFromRegex();
            String codeGender = utilService.getGenderCode(patternStr, idLastest);
            response.successResponse(codeGender, "Tạo mã giảm giá thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Double> useCoupon(String couponCode, Double sumPrice) {
        BaseResponseModel<Double> response = new BaseResponseModel<>();
        try {
            if (StringUtils.hasText(couponCode)) {
                CouponEntity couponEntity = couponRepository.findByCode(couponCode).orElse(null);
                if (couponEntity == null) {
                    response.errorResponse("Phiếu giảm giá không hợp lệ");
                    return response;
                }
                if (couponEntity.getDateStart().isAfter(LocalDateTime.now())) {
                    response.errorResponse("Phiếu giảm giá chưa đến ngày sử dụng");
                    return response;
                }
                if (couponEntity.getDateEnd().isBefore(LocalDateTime.now())) {
                    response.errorResponse("Phiếu giảm giá đã hết hạn sử dụng");
                    return response;
                }
                if (couponEntity.getQuantityUsed() > couponEntity.getQuantity()) {
                    response.errorResponse("Phiếu giảm giá đã được sử dụng");
                    return response;
                }
                if ( sumPrice < couponEntity.getMaxValue()) {
                    response.errorResponse("Giá trị đơn hàng không đáp ứng điều kiện để sử dụng phiếu giảm giá");
                    return response;
                }

                if (couponEntity.getType().equals(CouponTypeEnum.COUPON_PERCENT)) {
                    sumPrice = (sumPrice * ((double) couponEntity.getCouponAmount() / 100));
                } else {
                    sumPrice = Double.valueOf(couponEntity.getCouponAmount());
                }
                response.successResponse(sumPrice, "Thành công");
                return response;
            }
            response.errorResponse("Phiếu giảm giá không hợp lệ");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<CouponModel> getCouponByCode(String code) {
        BaseResponseModel<CouponModel> response = new BaseResponseModel<>();
        try {
            CouponEntity couponEntity = couponRepository.findByCode(code).orElse(null);
            if (couponEntity == null) {
                response.errorResponse("Coupon not found");
                return response;
            }
            CouponModel couponModel = couponEntity.toCouponModel();
            response.successResponse(couponModel, "Success");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
