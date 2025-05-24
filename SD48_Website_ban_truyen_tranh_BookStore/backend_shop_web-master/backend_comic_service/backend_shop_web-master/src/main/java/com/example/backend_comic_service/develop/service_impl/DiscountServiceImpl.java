package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.DiscountEntity;
import com.example.backend_comic_service.develop.entity.ProductDiscountEntity;
import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CouponRequest;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.model.request.DiscountRequest;
import com.example.backend_comic_service.develop.repository.DiscountRepository;
import com.example.backend_comic_service.develop.repository.ProductDiscountRepository;
import com.example.backend_comic_service.develop.repository.ProductRepository;
import com.example.backend_comic_service.develop.service.IDiscountService;
import com.example.backend_comic_service.develop.utils.AuthenticationService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.DiscountValidator;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DiscountServiceImpl implements IDiscountService {

    @Autowired
    private DiscountRepository discountRepository;
    @Autowired
    private DiscountValidator discountValidator;
    @Autowired
    private UtilService utilService;
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductDiscountRepository productDiscountRepository;

    @Override
    public BaseResponseModel<DiscountModel> addOrChange(DiscountRequest discountModel) {
        BaseResponseModel<DiscountModel> response = new BaseResponseModel<>();
        try {
            String errorMessage = discountValidator.validator(discountModel);
            if (StringUtils.hasText(errorMessage)) {
                response.errorResponse(errorMessage);
                return response;
            }
            UserEntity userEntity = authenticationService.authenToken();
            if (userEntity == null) {
                response.errorResponse("Xác thực người dùng thất bại");
                return response;
            }
            DiscountEntity discountEntity = new DiscountEntity();
            if (discountModel.getId() != null) {
                discountEntity = discountRepository.findById(discountModel.getId()).orElse(null);
                if (discountEntity == null) {
                    response.errorResponse("Không tìm thất đợt giảm giá");
                    return response;
                }
                discountEntity.setStartDate(discountModel.getStartDate());
                discountEntity.setEndDate(discountModel.getEndDate());
                discountEntity.setDescription(discountModel.getDescription());
                discountEntity.setType(discountModel.getType());
                if (discountModel.getType() == 1) {
                    discountEntity.setPercent(discountModel.getPercent());
                } else {
                    discountEntity.setMoneyDiscount(discountModel.getMoneyDiscount());
                }
            } else {
                discountEntity = discountModel.toEntity();
                discountEntity.setCreatedBy(userEntity.getId());
                discountEntity.setCreatedDate(LocalDateTime.now());
            }
            discountEntity.setUpdatedBy(userEntity.getId());
            discountEntity.setUpdatedDate(LocalDateTime.now());
            discountEntity.setStatus(this.getStatus(discountModel));
            DiscountEntity discount = discountRepository.saveAndFlush(discountEntity);
            if (discount.getId() != null) {
                if (discountModel.getId() != null && discountModel.getId() > 0) {
                    discountRepository.deleteProductWithDiscountId(discountModel.getId());
                }
                if (!discountModel.getProductIds().isEmpty()) {
                    List<ProductEntity> productEntities = productRepository.getListProductByIds(discountModel.getProductIds());
                    List<ProductDiscountEntity> productDiscountEntities = new ArrayList<>();
                    for (ProductEntity item : productEntities) {
                        ProductDiscountEntity productDiscountEntity = new ProductDiscountEntity();
                        productDiscountEntity.setDiscount(discount);
                        productDiscountEntity.setProduct(item);
                        productDiscountEntity.setStatus(1);
                        productDiscountEntity.setIsDeleted(0);
                        productDiscountEntities.add(productDiscountEntity);
                    }
                    productDiscountRepository.saveAllAndFlush(productDiscountEntities);
                }
                response.successResponse(discountEntity.toDiscountModel(), "Sửa thành công");
                return response;
            }
            response.errorResponse("Thêm thất bại");
            return response;

        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    private Integer getStatus(DiscountRequest model) {
        LocalDateTime dateStart = model.getStartDate();
        LocalDateTime dateEnd = model.getEndDate();
        Integer status = 2;
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
    public BaseResponseModel<DiscountModel> getDiscountById(Integer id) {
        BaseResponseModel<DiscountModel> response = new BaseResponseModel<>();
        try {
            DiscountEntity discountEntity = discountRepository.findById(id).orElse(null);
            if (discountEntity == null) {
                response.errorResponse("Không tìm thấy đợt giảm giá");
                return response;
            }
            DiscountModel discountModel = discountEntity.toDiscountModel();
            response.successResponse(discountModel, "Thành công");
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
            DiscountEntity discountEntity = discountRepository.findById(id).orElse(null);
            if (discountEntity == null) {
                response.errorResponse("Không tìm thấy đợt giảm giá");
                return response;
            }
            discountRepository.updateDeleteDiscount(discountEntity.getId(), status);
            response.successResponse(id, "Xóa đợt giảm giá thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<DiscountModel> getListDiscount(
            LocalDateTime startDate, LocalDateTime endDate, Integer minValue,
            Integer maxValue, String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<DiscountModel> response = new BaseListResponseModel<>();
        try {
            // Giả sử discountRepository.getListDiscount có các tham số minValue, maxValue
            // Nếu không, bạn cần điều chỉnh lời gọi hoặc thêm chúng vào query của repository
            Page<DiscountEntity> entityPage = discountRepository.getListDiscount(
                    startDate, endDate, minValue, maxValue, keySearch, status, pageable
            );

            List<DiscountModel> discountModels = new ArrayList<>();
            int totalElements = 0;

            if (entityPage != null && !entityPage.getContent().isEmpty()) {
                discountModels = entityPage.getContent().stream()
                        .map(DiscountEntity::toDiscountModel) // Giả sử DiscountEntity có toDiscountModel()
                        .collect(Collectors.toList());
                totalElements = (int) entityPage.getTotalElements();
            }

            int currentPageIndex = pageable.getPageNumber() + 1;
            int currentPageSize = pageable.getPageSize();

            if (discountModels.isEmpty()) {
                response.successResponse(new ArrayList<>(), 0, "Danh sách đợt giảm giá trống", currentPageIndex, currentPageSize);
            } else {
                response.successResponse(discountModels, totalElements, "Lấy danh sách đợt giảm giá thành công", currentPageIndex, currentPageSize);
            }

        } catch (Exception e) {
            // log.error("Lỗi khi lấy danh sách đợt giảm giá: {}", e.getMessage(), e); // Nên có log
            response.errorResponse("Lỗi hệ thống khi lấy danh sách đợt giảm giá: " + e.getMessage(),
                    pageable.getPageNumber() + 1,
                    pageable.getPageSize());
        }
        return response;
    }

    @Override
    public BaseResponseModel<String> generateDiscountCode() {
        BaseResponseModel<String> response = new BaseResponseModel<>();
        try {
            Integer idLastest = discountRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("DIS", idLastest);
            response.successResponse(codeGender, "Tạo mã đợt giảm giá thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
