package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.CatalogEntity;
import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.CatalogModel;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.repository.CatalogRepository;
import com.example.backend_comic_service.develop.repository.UserRepository;
import com.example.backend_comic_service.develop.service.ICatalogService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.CatalogValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CatalogServiceImpl implements ICatalogService {

    private final CatalogRepository catalogRepository;
    private final CatalogValidator catalogValidator;
    private final UtilService utilService;
    private final UserRepository userRepository;

    @Autowired
    public CatalogServiceImpl(CatalogRepository catalogRepository, CatalogValidator catalogValidator, UtilService utilService, UserRepository userRepository) {
        this.catalogRepository = catalogRepository;
        this.catalogValidator = catalogValidator;
        this.utilService = utilService;
        this.userRepository = userRepository;
    }

    @Override
    public BaseListResponseModel<CatalogModel> getList(String keySearch, Integer status, Pageable pageable) {
        // T_ITEM của BaseListResponseModel là CatalogModel
        BaseListResponseModel<CatalogModel> response = new BaseListResponseModel<>();
        try {
            Page<CatalogEntity> catalogEntitiesPage = catalogRepository.getList(keySearch, status, pageable);

            List<CatalogModel> catalogModels = new ArrayList<>();
            int totalElements = 0;

            if (catalogEntitiesPage != null && !catalogEntitiesPage.getContent().isEmpty()) {
                catalogModels = catalogEntitiesPage.getContent().stream()
                        .map(CatalogEntity::toModel) // Giả sử CatalogEntity có toModel()
                        .collect(Collectors.toList());
                totalElements = (int) catalogEntitiesPage.getTotalElements();
            }

            int currentPageIndex = pageable.getPageNumber() + 1; // Trang hiện tại (1-based)
            int currentPageSize = pageable.getPageSize();    // Kích thước trang

            if (catalogModels.isEmpty()) {
                // Gọi phương thức successResponse 5 tham số của BaseListResponseModel
                // listData ở đây là List<CatalogModel>
                response.successResponse(new ArrayList<>(), 0, "Danh sách danh mục trống", currentPageIndex, currentPageSize);
            } else {
                // Gọi phương thức successResponse 5 tham số của BaseListResponseModel
                // listData ở đây là List<CatalogModel>
                response.successResponse(catalogModels, totalElements, "Lấy danh sách danh mục thành công", currentPageIndex, currentPageSize);
            }

        } catch (Exception e) {
            // log.error("Lỗi khi lấy danh sách danh mục: {}", e.getMessage(), e); // Nên có log
            // Gọi phương thức errorResponse 3 tham số của BaseListResponseModel
            response.errorResponse("Lỗi khi lấy danh sách danh mục: " + e.getMessage(),
                    pageable.getPageNumber() + 1, // Hoặc giá trị mặc định
                    pageable.getPageSize());    // Hoặc giá trị mặc định
        }
        return response;
    }

    @Override
    public BaseResponseModel<Integer> addOrChange(CatalogModel catalogModel) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            String errorMessage = catalogValidator.validate(catalogModel);
            if (StringUtils.hasText(errorMessage)) {
                response.errorResponse(errorMessage);
                return response;
            }
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                UserEntity userCreate = userRepository.findUserEntitiesByUserNameAndStatus(username, 1).orElse(null);
                if (userCreate == null) {
                    response.errorResponse("Mã thông báo người dùng không hợp lệ");
                    return response;
                }
                CatalogEntity catalogEntity = catalogRepository.findByName(catalogModel.getName().replaceAll("\\s+", " ").trim());
                if (catalogEntity != null && !catalogEntity.getId().equals(catalogModel.getId())) {
                    response.errorResponse("Danh mục đã tồn tại !");
                    return response;
                }

                if (Optional.ofNullable(catalogModel.getId()).orElse(0) == 0) {
                    catalogModel.setCreatedBy(userCreate.getId());
                    catalogModel.setCreatedDate(LocalDateTime.now());
                }
                catalogModel.setUpdatedBy(userCreate.getId());
                catalogModel.setUpdatedDate(LocalDateTime.now());
            } catch (Exception e) {
                log.error(e.getMessage());
                response.errorResponse(e.getMessage());
                return response;
            }
            CatalogEntity catalogEntitySave = catalogRepository.saveAndFlush(catalogModel.toEntity());
            if (catalogEntitySave.getId() != null) {
                response.successResponse(catalogEntitySave.getId(), "Thành công");
                return response;
            }
            response.errorResponse("Sửa danh mục thất bại");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> deleteCategory(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            if (id == null) {
                response.errorResponse("Id không tồn tại");
                return response;
            }
            Optional<CatalogEntity> catalogEntity = catalogRepository.getCatalogEntityById(id);
            if (catalogEntity.isEmpty()) {
                response.errorResponse("Danh mục không tồn tại với " + id);
                return response;
            }
            catalogRepository.updateCategory(catalogEntity.get().getId(), status);
            response.successResponse(catalogEntity.get().getId(), "Xóa danh mục thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<CatalogModel> getById(Integer id) {
        BaseResponseModel<CatalogModel> response = new BaseResponseModel<>();
        try {
            if (id == null) {
                response.errorResponse("Id không tồn tại");
                return response;
            }
            Optional<CatalogEntity> catalogEntity = catalogRepository.getCatalogEntityById(id);
            if (catalogEntity.isEmpty()) {
                response.errorResponse("Danh mục không tồn tại với id " + id);
                return response;
            }
            response.successResponse(catalogEntity.get().toModel(), "Thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<String> generateCode() {
        BaseResponseModel<String> response = new BaseResponseModel<>();
        try {
            Integer idLastest = catalogRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("CATALOG", idLastest);
            response.successResponse(codeGender, "Tạo mã danh mục thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
