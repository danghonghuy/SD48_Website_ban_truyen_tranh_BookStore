package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.CatalogEntity;
import com.example.backend_comic_service.develop.entity.CategoryEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.CategoryModel;
import com.example.backend_comic_service.develop.repository.CatalogRepository;
import com.example.backend_comic_service.develop.repository.CategoryRepository;
import com.example.backend_comic_service.develop.repository.UserRepository;
import com.example.backend_comic_service.develop.service.ICategoryService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.CategoryValidator;
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
public class CategoryServiceImpl implements ICategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryValidator categoryValidator;
    private final UtilService utilService;
    private final UserRepository userRepository;
    private final CatalogRepository catalogRepository;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryValidator categoryValidator, UtilService utilService, UserRepository userRepository, CatalogRepository catalogRepository) {
        this.categoryRepository = categoryRepository;
        this.categoryValidator = categoryValidator;
        this.utilService = utilService;
        this.userRepository = userRepository;
        this.catalogRepository = catalogRepository;
    }

    @Override
// SỬA: Kiểu trả về là BaseListResponseModel<CategoryModel>
    public BaseListResponseModel<CategoryModel> getListCategory(String keySearch, Integer status, Pageable pageable) {
        // SỬA: T_ITEM của BaseListResponseModel là CategoryModel
        BaseListResponseModel<CategoryModel> response = new BaseListResponseModel<>();
        try {
            Page<CategoryEntity> categoryEntitiesPage = categoryRepository.getListCategory(keySearch, status, pageable); // Đổi tên biến

            List<CategoryModel> categoryModels = new ArrayList<>();
            int totalElements = 0;

            if (categoryEntitiesPage != null && !categoryEntitiesPage.getContent().isEmpty()) {
                categoryModels = categoryEntitiesPage.getContent().stream()
                        .map(CategoryEntity::categoryModel) // Giả sử CategoryEntity.categoryModel() là phương thức đúng
                        .collect(Collectors.toList());
                totalElements = (int) categoryEntitiesPage.getTotalElements();
            }

            int currentPageIndex = pageable.getPageNumber() + 1; // Trang hiện tại (1-based)
            int currentPageSize = pageable.getPageSize();    // Kích thước trang

            if (categoryModels.isEmpty()) {
                // SỬA: Gọi phương thức successResponse 5 tham số của BaseListResponseModel
                response.successResponse(new ArrayList<>(), 0, "Danh sách thể loại trống", currentPageIndex, currentPageSize);
            } else {
                // SỬA: Gọi phương thức successResponse 5 tham số của BaseListResponseModel
                response.successResponse(categoryModels, totalElements, "Lấy danh sách thể loại thành công", currentPageIndex, currentPageSize);
            }

        } catch (Exception e) {
            // log.error("Lỗi khi lấy danh sách thể loại: {}", e.getMessage(), e); // Nên có log
            // SỬA: Gọi phương thức errorResponse 3 tham số của BaseListResponseModel
            response.errorResponse("Lỗi khi lấy danh sách thể loại: " + e.getMessage(),
                    pageable.getPageNumber() + 1, // Hoặc giá trị mặc định
                    pageable.getPageSize());    // Hoặc giá trị mặc định
        }
        return response;
    }
    @Override
    public BaseResponseModel<Integer> addOrChange(CategoryModel categoryModel) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            String errorMessage = categoryValidator.validate(categoryModel);
            if (StringUtils.hasText(errorMessage)) {
                response.errorResponse(errorMessage);
                return response;
            }
            CategoryEntity categoryEntity = new CategoryEntity();
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                UserEntity userCreate = userRepository.findUserEntitiesByUserNameAndStatus(username, 1).orElse(null);
                if (userCreate == null) {
                    response.errorResponse("Mã thông báo người dùng không hợp lệ");
                    return response;
                }

                CategoryEntity catalogEntityName = categoryRepository.findByName(categoryModel.getName().replaceAll("\\s+", " ").trim());
                if (catalogEntityName != null && !catalogEntityName.getId().equals(categoryModel.getId())) {
                    response.errorResponse("Loại sản phẩm đã tồn tại !");
                    return response;
                }

                if (Optional.ofNullable(categoryModel.getId()).orElse(0) == 0) {
                    categoryEntity = categoryModel.categoryEntity();
                    categoryModel.setCreatedBy(userCreate.getId());
                    categoryModel.setCreatedDate(LocalDateTime.now());
                } else {
                    categoryEntity = categoryRepository.findById(categoryModel.getId()).orElse(null);
                    if (categoryEntity == null) {
                        response.errorResponse("Id danh mục không hợp lệ");
                        return response;
                    }
                    categoryEntity.setName(categoryModel.getName());
                    categoryEntity.setDescription(categoryModel.getDescription());
                }
                categoryModel.setUpdatedBy(userCreate.getId());
                categoryModel.setUpdatedDate(LocalDateTime.now());
            } catch (Exception e) {
                log.error(e.getMessage());
                response.errorResponse(e.getMessage());
                return response;
            }
            Optional<CatalogEntity> catalogEntity = catalogRepository.getCatalogEntityById(categoryModel.getCatalogId());
            if (catalogEntity.isEmpty()) {
                response.errorResponse("Thể loại không tồn tại");
                return response;
            }
            categoryEntity.setCatalogEntity(catalogEntity.get());
            CategoryEntity categoryEntitySave = categoryRepository.saveAndFlush(categoryEntity);
            if (categoryEntitySave.getId() != null) {
                response.successResponse(categoryEntitySave.getId(), "Thành công");
                return response;
            }
            response.errorResponse("Thất bại");
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
                response.errorResponse("Id not exist");
                return response;
            }
            Optional<CategoryEntity> categoryEntityOption = categoryRepository.getCategoryEntitiesById(id);
            if (categoryEntityOption.isEmpty()) {
                response.errorResponse("Category not exist with id " + id);
                return response;
            }
            categoryRepository.updateCategory(categoryEntityOption.get().getId(), status);
            response.successResponse(categoryEntityOption.get().getId(), "Delete category success");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<CategoryModel> getCategoryDetail(Integer id) {
        BaseResponseModel<CategoryModel> response = new BaseResponseModel<>();
        try {
            if (id == null) {
                response.errorResponse("Id not exist");
                return response;
            }
            Optional<CategoryEntity> categoryEntityOption = categoryRepository.getCategoryEntitiesById(id);
            if (categoryEntityOption.isEmpty()) {
                response.errorResponse("Category not exist with id " + id);
                return response;
            }
            response.successResponse(categoryEntityOption.get().categoryModel(), "Success");
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
            Integer idLastest = categoryRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("CAT", idLastest);
            response.successResponse(codeGender, "Generate category code success");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
