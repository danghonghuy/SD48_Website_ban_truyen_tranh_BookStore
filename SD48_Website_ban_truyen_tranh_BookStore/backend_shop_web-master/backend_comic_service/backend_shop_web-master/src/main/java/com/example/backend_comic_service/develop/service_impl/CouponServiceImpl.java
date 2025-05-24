package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.constants.CouponTypeEnum; // Đảm bảo import này đúng
import com.example.backend_comic_service.develop.entity.CouponEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CouponModel;
import com.example.backend_comic_service.develop.model.model.CouponRequest;
import com.example.backend_comic_service.develop.repository.CouponRepository;
import com.example.backend_comic_service.develop.service.ICouponService;
import com.example.backend_comic_service.develop.utils.AuthenticationService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.CouponValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
        log.info("Processing addOrChange for CouponRequest: {}", model.toString());
        BaseResponseModel<CouponModel> response = new BaseResponseModel<>();
        try {
            couponValidator.validate(model);

            UserEntity userEntity = authenticationService.authenToken();
            if (userEntity == null) {
                response.errorResponse("Xác thực người dùng không thành công");
                return response;
            }

            CouponEntity couponEntityToSave;
            if (model.getId() != null) {
                couponEntityToSave = couponRepository.findById(model.getId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu giảm giá với ID: " + model.getId()));

                couponEntityToSave.setName(model.getName());
                couponEntityToSave.setDescription(model.getDescription());
                couponEntityToSave.setPercentValue(model.getPercentValue());
                couponEntityToSave.setQuantity(model.getQuantity());
                couponEntityToSave.setCouponAmount(model.getCouponAmount());
                couponEntityToSave.setMaxValue(model.getMaxValue());
                couponEntityToSave.setMinValue(model.getMinValue());

                if (model.getDateStart() != null && !model.getDateStart().isEmpty()) {
                    couponEntityToSave.setDateStart(Instant.parse(model.getDateStart()));
                } else {
                    couponEntityToSave.setDateStart(null);
                }
                if (model.getDateEnd() != null && !model.getDateEnd().isEmpty()) {
                    couponEntityToSave.setDateEnd(Instant.parse(model.getDateEnd()));
                } else {
                    couponEntityToSave.setDateEnd(null);
                }
                couponEntityToSave.setUpdated_by(userEntity.getId());
                couponEntityToSave.setUpdatedDate(Instant.now());
            } else {
                couponEntityToSave = new CouponEntity();
                couponEntityToSave.setCode(model.getCode());
                couponEntityToSave.setName(model.getName());
                couponEntityToSave.setDescription(model.getDescription());
                couponEntityToSave.setType(model.getType());
                couponEntityToSave.setPercentValue(model.getPercentValue());
                couponEntityToSave.setQuantity(model.getQuantity());
                couponEntityToSave.setCouponAmount(model.getCouponAmount());
                couponEntityToSave.setMaxValue(model.getMaxValue());
                couponEntityToSave.setMinValue(model.getMinValue());

                if (model.getDateStart() != null && !model.getDateStart().isEmpty()) {
                    couponEntityToSave.setDateStart(Instant.parse(model.getDateStart()));
                }
                if (model.getDateEnd() != null && !model.getDateEnd().isEmpty()) {
                    couponEntityToSave.setDateEnd(Instant.parse(model.getDateEnd()));
                }

                couponEntityToSave.setCreatedBy(userEntity.getId());
                couponEntityToSave.setCreatedDate(Instant.now());
                couponEntityToSave.setUpdated_by(userEntity.getId());
                couponEntityToSave.setUpdatedDate(Instant.now());
                couponEntityToSave.setIsDelete(0);
                couponEntityToSave.setQuantityUsed(0);
            }

            couponEntityToSave.setStatus(this.getStatusFromInstants(couponEntityToSave.getDateStart(), couponEntityToSave.getDateEnd()));

            CouponEntity savedCoupon = couponRepository.saveAndFlush(couponEntityToSave);

            if (savedCoupon.getId() != null) {
                response.setData(savedCoupon.toCouponModel());
                response.successResponse(savedCoupon.toCouponModel(), model.getId() != null ? "Cập nhật thành công" : "Thêm mới thành công");
            } else {
                response.errorResponse("Thao tác với phiếu giảm giá thất bại");
            }
            return response;

        } catch (Exception e) {
            log.error("Lỗi trong CouponService.addOrChange: {}", e.getMessage(), e);
            response.errorResponse("Đã xảy ra lỗi hệ thống: " + e.getMessage());
            return response;
        }
    }

    private Integer getStatusFromInstants(Instant dateStart, Instant dateEnd) {
        Integer status = 2;
        Instant now = Instant.now();

        if (dateStart == null || dateEnd == null) {
            log.warn("dateStart hoặc dateEnd là null khi xác định trạng thái coupon bằng Instant.");
            return 2;
        }
        if (dateEnd.isBefore(dateStart)) {
            log.warn("Ngày kết thúc {} trước ngày bắt đầu {} khi xác định trạng thái coupon.", dateEnd, dateStart);
            return 0;
        }
        if (now.isBefore(dateStart)) {
            status = 2;
        } else if (now.isAfter(dateEnd)) {
            status = 0;
        } else {
            status = 1;
        }
        log.info("Calculated status (Instant): {} for dateStart: {}, dateEnd: {}, now: {}", status, dateStart, dateEnd, now);
        return status;
    }

    @Override
    public BaseResponseModel<CouponModel> getCouponById(Integer id) {
        BaseResponseModel<CouponModel> response = new BaseResponseModel<>();
        try {
            CouponEntity couponEntity = couponRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu giảm giá với ID: " + id));
            CouponModel couponModel = couponEntity.toCouponModel();
            response.successResponse(couponModel, "Thành công");
            return response;
        } catch (Exception e) {
            log.error("Lỗi khi lấy coupon by ID {}: {}", id, e.getMessage(), e);
            response.errorResponse("Lỗi hệ thống khi lấy chi tiết coupon: " + e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> delete(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            CouponEntity couponEntity = couponRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu giảm giá với ID: " + id));
            couponRepository.updateDeleteCoupon(couponEntity.getId(), status);
            response.successResponse(id, "Cập nhật trạng thái xóa phiếu giảm giá thành công");
            return response;
        } catch (Exception e) {
            log.error("Lỗi khi xóa coupon ID {}: {}", id, e.getMessage(), e);
            response.errorResponse("Lỗi hệ thống khi xóa coupon: " + e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<CouponModel> getListCoupon(
            LocalDateTime startDate, LocalDateTime endDate,
            Integer minValue, Integer maxValue, String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<CouponModel> response = new BaseListResponseModel<>();
        try {
            Page<CouponEntity> entityPage = couponRepository.getListCoupon(
                    startDate, endDate, minValue, maxValue, keySearch, status, pageable
            );

            List<CouponModel> couponModels = new ArrayList<>();
            int totalElements = 0;

            if (entityPage != null && !entityPage.getContent().isEmpty()) {
                couponModels = entityPage.getContent().stream()
                        .map(CouponEntity::toCouponModel)
                        .collect(Collectors.toList());
                totalElements = (int) entityPage.getTotalElements();
            }

            int currentPageIndex = pageable.getPageNumber() + 1;
            int currentPageSize = pageable.getPageSize();

            if (couponModels.isEmpty()) {
                response.successResponse(new ArrayList<>(), 0, "Danh sách phiếu giảm giá trống", currentPageIndex, currentPageSize);
            } else {
                response.successResponse(couponModels, totalElements, "Lấy danh sách phiếu giảm giá thành công", currentPageIndex, currentPageSize);
            }

        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách coupon: {}", e.getMessage(), e);
            response.errorResponse("Lỗi hệ thống khi lấy danh sách coupon: " + e.getMessage(),
                    pageable.getPageNumber() + 1,
                    pageable.getPageSize());
        }
        return response;
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
            log.error("Lỗi khi tạo mã coupon: {}", e.getMessage(), e);
            response.errorResponse("Lỗi hệ thống khi tạo mã coupon: " + e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Double> useCoupon(String couponCode, Double sumPrice) {
        BaseResponseModel<Double> response = new BaseResponseModel<>();
        try {
            if (!StringUtils.hasText(couponCode)) {
                response.errorResponse("Mã phiếu giảm giá không được để trống");
                return response;
            }
            CouponEntity couponEntity = couponRepository.findByCode(couponCode)
                    .orElseThrow(() -> new RuntimeException("Phiếu giảm giá không hợp lệ: " + couponCode));

            Instant now = Instant.now();
            if (couponEntity.getDateStart() == null || couponEntity.getDateStart().isAfter(now)) {
                response.errorResponse("Phiếu giảm giá chưa đến ngày sử dụng hoặc ngày bắt đầu không hợp lệ");
                return response;
            }
            if (couponEntity.getDateEnd() == null || couponEntity.getDateEnd().isBefore(now)) {
                response.errorResponse("Phiếu giảm giá đã hết hạn sử dụng hoặc ngày kết thúc không hợp lệ");
                return response;
            }
            if (couponEntity.getQuantityUsed() >= couponEntity.getQuantity()) {
                response.errorResponse("Phiếu giảm giá đã hết lượt sử dụng");
                return response;
            }
            if (couponEntity.getMinValue() != null && sumPrice < couponEntity.getMinValue()) {
                response.errorResponse("Giá trị đơn hàng không đáp ứng điều kiện tối thiểu để sử dụng phiếu giảm giá");
                return response;
            }

            double discountedPrice = sumPrice;
            // Giả sử type 1 là phần trăm, type 2 là giá trị cố định
            if (couponEntity.getType() == 1) { // Giảm phần trăm
                if (couponEntity.getPercentValue() != null) {
                    double discountAmount = sumPrice * (couponEntity.getPercentValue() / 100.0);
                    if (couponEntity.getMaxValue() != null && discountAmount > couponEntity.getMaxValue()) {
                        discountAmount = couponEntity.getMaxValue();
                    }
                    discountedPrice -= discountAmount;
                }
            } else if (couponEntity.getType() == 2) { // Giảm tiền cố định
                if (couponEntity.getCouponAmount() != null) {
                    discountedPrice -= couponEntity.getCouponAmount();
                }
            }

            discountedPrice = Math.max(0, discountedPrice);

            response.successResponse(discountedPrice, "Áp dụng phiếu giảm giá thành công");
            return response;

        } catch (RuntimeException e) {
            log.warn("Lỗi khi sử dụng coupon (RuntimeException): {}", e.getMessage());
            response.errorResponse(e.getMessage());
            return response;
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi sử dụng coupon {}: {}", couponCode, e.getMessage(), e);
            response.errorResponse("Lỗi hệ thống khi sử dụng coupon: " + e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<CouponModel> getCouponByCode(String code) {
        BaseResponseModel<CouponModel> response = new BaseResponseModel<>();
        try {
            CouponEntity couponEntity = couponRepository.findByCode(code)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy coupon với mã: " + code));
            CouponModel couponModel = couponEntity.toCouponModel();
            response.successResponse(couponModel, "Thành công");
            return response;
        } catch (RuntimeException e) {
            log.warn("Lỗi khi lấy coupon by code (RuntimeException): {}", e.getMessage());
            response.errorResponse(e.getMessage());
            return response;
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi lấy coupon by code {}: {}", code, e.getMessage(), e);
            response.errorResponse("Lỗi hệ thống khi lấy coupon: " + e.getMessage());
            return response;
        }
    }
}