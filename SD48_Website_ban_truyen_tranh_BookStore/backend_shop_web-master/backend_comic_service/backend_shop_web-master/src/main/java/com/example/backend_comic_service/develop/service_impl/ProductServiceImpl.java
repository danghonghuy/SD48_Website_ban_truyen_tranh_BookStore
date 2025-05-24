package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.*;
import com.example.backend_comic_service.develop.exception.ServiceException;
import com.example.backend_comic_service.develop.exception.ResourceNotFoundException;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.dto.DiscountDTO;
import com.example.backend_comic_service.develop.model.dto.ImageDTO;
import com.example.backend_comic_service.develop.model.excel.ExcelImportResult;
import com.example.backend_comic_service.develop.model.excel.ExcelRowError;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.model.request.product.ProductRequest;
import com.example.backend_comic_service.develop.repository.*;
import com.example.backend_comic_service.develop.service.IProductService;
import com.example.backend_comic_service.develop.utils.ErrorCodeConst;
import com.example.backend_comic_service.develop.utils.HandleImageService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.ProductValidator;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Transactional
@Service
@Slf4j
public class ProductServiceImpl extends GenerateService implements IProductService {

    private final ProductRepository productRepository;
    private final UtilService utilService;
    private final ProductValidator productValidator;
    private final CategoryRepository categoryRepository;
    private final TypeRepository typeRepository;
    private final UserRepository userRepository;
    private final HandleImageService handleImageService;
    private final DiscountRepository discountRepository;
    private final ImageRepository imageRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final DistributorRepository distributorRepository;

    @Value("${com.develop.path-save-image}")
    private String saveImagePath;
    private static final int COMPLETED_ORDER_STATUS = 5;

    private static final int COL_TEN_SAN_PHAM = 1;
    private static final int COL_MO_TA = 2;
    private static final int COL_NGAY_XUAT_BAN = 3;
    private static final int COL_GIA_BAN = 4;
    private static final int COL_SO_LUONG_TON = 5;
    private static final int COL_MA_DANH_MUC_ID = 6;
    private static final int COL_MA_LOAI_ID = 7;
    private static final int COL_TAC_GIA_IDS = 8;
    private static final int COL_NHA_XUAT_BAN_ID = 9;
    private static final int COL_NHA_PHAT_HANH_ID = 10;
    private static final int COL_NGAY_PHAT_HANH = 11;
    private static final int COL_TRANG_THAI = 12;
    private static final int COL_HINH_ANH = 13;


    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, UtilService utilService, ProductValidator productValidator,
                              CategoryRepository categoryRepository, TypeRepository typeRepository,
                              UserRepository userRepository, HandleImageService handleImageService,
                              ImageRepository imageRepository, DiscountRepository discountRepository,
                              OrderDetailRepository orderDetailRepository, AuthorRepository authorRepository,
                              PublisherRepository publisherRepository, DistributorRepository distributorRepository) {
        this.productRepository = productRepository;
        this.utilService = utilService;
        this.productValidator = productValidator;
        this.categoryRepository = categoryRepository;
        this.typeRepository = typeRepository;
        this.userRepository = userRepository;
        this.handleImageService = handleImageService;
        this.imageRepository = imageRepository;
        this.discountRepository = discountRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.distributorRepository = distributorRepository;
    }

    private double getBasePrice(ProductEntity product) {
        if (product == null) {
            log.warn("Sản phẩm là null khi cố gắng lấy giá cơ sở.");
            return 0.0;
        }
        // Giả định price và priceDiscount trong ProductEntity là kiểu float (nguyên thủy)
        if (product.getPriceDiscount() > 0) {
            return product.getPriceDiscount();
        }
        if (product.getPrice() > 0) {
            return product.getPrice();
        }
        log.warn("Sản phẩm ID {} có giá gốc (price) không hợp lệ (<= 0): {}", product.getId(), product.getPrice());
        return 0.0;
    }

    private double calculateEffectivePriceForProduct(ProductEntity product, LocalDateTime calculationTime) {
        if (product == null) {
            log.warn("calculateEffectivePriceForProduct được gọi với product là null.");
            return 0;
        }
        double basePrice = getBasePrice(product);
        if (basePrice <= 0 && product.getPrice() <=0) {
            log.warn("Giá cơ sở cho sản phẩm ID {} là không dương ({}). Không áp dụng khuyến mãi.", product.getId(), basePrice);
            return basePrice;
        }

        List<DiscountEntity> activeDiscounts = discountRepository.findActiveDiscountsForProductAtTime(product.getId(), calculationTime);
        if (activeDiscounts.isEmpty()) {
            return basePrice;
        }

        double bestFinalPrice = basePrice;
        for (DiscountEntity discount : activeDiscounts) {
            double priceAfterThisDiscount = basePrice;
            if (discount.getType() != null) {
                if (discount.getType() == 1 && discount.getPercent() != null && discount.getPercent() > 0) {
                    double discountAmount = basePrice * (discount.getPercent() / 100.0);
                    priceAfterThisDiscount = basePrice - discountAmount;
                } else if (discount.getType() == 2 && discount.getMoneyDiscount() != null && discount.getMoneyDiscount() > 0) {
                    priceAfterThisDiscount = basePrice - discount.getMoneyDiscount();
                }
            }
            if (priceAfterThisDiscount < bestFinalPrice) {
                bestFinalPrice = priceAfterThisDiscount;
            }
        }
        return Math.max(0, bestFinalPrice);
    }

    @Override
    public double getEffectivePrice(Integer productId, LocalDateTime calculationTime) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + productId));
        return calculateEffectivePriceForProduct(product, calculationTime);
    }

    private ProductModel enrichProductModelWithPrice(ProductEntity productEntity, LocalDateTime calculationTime) {
        ProductModel productModel = productEntity.toProductModel();
        double originalPrice = getBasePrice(productEntity);
        double effectivePrice = calculateEffectivePriceForProduct(productEntity, calculationTime);
        productModel.setOriginalPrice(originalPrice);
        productModel.setFinalPrice(effectivePrice);

        List<DiscountEntity> activeDiscounts = discountRepository.findActiveDiscountsForProductAtTime(productEntity.getId(), calculationTime);
        if (!CollectionUtils.isEmpty(activeDiscounts) && productModel.getDiscountDTO() == null) {
            DiscountEntity bestDiscount = activeDiscounts.stream()
                    .min(Comparator.comparingDouble(d -> {
                        double priceAfterThis = originalPrice;
                        if (d.getType() != null) {
                            if (d.getType() == 1 && d.getPercent() != null) {
                                priceAfterThis = originalPrice * (1 - (d.getPercent() / 100.0));
                            } else if (d.getType() == 2 && d.getMoneyDiscount() != null) {
                                priceAfterThis = originalPrice - d.getMoneyDiscount();
                            }
                        }
                        return Math.max(0, priceAfterThis);
                    }))
                    .orElse(null);

            if (bestDiscount != null) {
                productModel.setDiscountDTO(bestDiscount.toDiscountDTO());
            }
        }
        return productModel;
    }

    @Override
    public BaseResponseModel<ProductModel> addOrChangeProduct(ProductRequest productRequest, List<MultipartFile> files) {
        BaseResponseModel<ProductModel> response = new BaseResponseModel<>();
        UserEntity currentUser = null;
        try {
            Optional<ProductEntity> entityOptByName = productRepository.findByNameExactly(productRequest.getName().replaceAll("\\s+", " ").trim());
            if (entityOptByName.isPresent() && (productRequest.getId() == null || !entityOptByName.get().getId().equals(productRequest.getId()))) {
                response.errorResponse("Tên sản phẩm đã tồn tại!");
                return response;
            }
            ProductEntity productEntity;
            String successMessage;
            if (productRequest.getId() != null && productRequest.getId() != 0) {
                productEntity = productRepository.findById(productRequest.getId())
                        .orElseThrow(() -> new ServiceException(ErrorCodeConst.NOT_FOUND_PRODUCT, "Không tìm thấy sản phẩm để cập nhật."));
                successMessage = "Cập nhật sản phẩm thành công!";
            } else {
                productEntity = new ProductEntity();
                productEntity.setIsDeleted(0);
                successMessage = "Thêm mới sản phẩm thành công!";
            }
            productEntity.setCode(StringUtils.hasText(productRequest.getCode()) ? productRequest.getCode() : utilService.getGenderCode("PRO", productRepository.getIdGenerateCode() == null ? 1 : productRepository.getIdGenerateCode() + 1));
            productEntity.setName(productRequest.getName().replaceAll("\\s+", " ").trim());
            productEntity.setDescription(productRequest.getDescription() != null ? productRequest.getDescription().replaceAll("\\s+", " ").trim() : null);
            productEntity.setDatePublish(productRequest.getDatePublish());
            productEntity.setPrice(productRequest.getPrice());
            productEntity.setPriceDiscount(productRequest.getPriceDiscount());
            productEntity.setStock(productRequest.getStock());
            productEntity.setFormat(productRequest.getFormat());
            productEntity.setCatalog(productRequest.getCatalog());
            productEntity.setSeries(productRequest.getSeries());
            productEntity.setDatePublic(productRequest.getDatePublic());
            productEntity.setStatus(productRequest.getStatus());
            TypeEntity typeEntity = typeRepository.findById(productRequest.getTypeId())
                    .orElseThrow(() -> new ServiceException(ErrorCodeConst.NOT_FOUND_TYPE, ErrorCodeConst.NOT_FOUND_TYPE.getMessage()));
            productEntity.setTypeEntity(typeEntity);
            CategoryEntity categoryEntity = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new ServiceException(ErrorCodeConst.NOT_FOUND_CATEGORY, ErrorCodeConst.NOT_FOUND_CATEGORY.getMessage()));
            productEntity.setCategoryEntity(categoryEntity);
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                currentUser = userRepository.findUserEntitiesByUserNameAndStatus(username, 1)
                        .orElseThrow(() -> new ServiceException(ErrorCodeConst.USER_NOT_VALID, ErrorCodeConst.USER_NOT_VALID.getMessage()));
                if (productEntity.getId() == null) {
                    productEntity.setCreatedBy(currentUser.getId());
                }
                productEntity.setUpdatedBy(currentUser.getId());
            } catch (jakarta.persistence.NonUniqueResultException nuRE) {
                log.error("Lỗi NonUniqueResultException khi lấy thông tin người dùng: ", nuRE);
                response.errorResponse("Lỗi hệ thống: Dữ liệu người dùng không nhất quán.");
                return response;
            }
            if (productRequest.getAuthorIds() != null && !productRequest.getAuthorIds().isEmpty()) {
                List<AuthorEntity> authors = authorRepository.findByIdIn(productRequest.getAuthorIds());
                if (authors.size() != productRequest.getAuthorIds().size()) {
                    log.warn("Một số Author ID không tìm thấy khi thêm/sửa sản phẩm: {}", productRequest.getName());
                }
                productEntity.setAuthors(new HashSet<>(authors));
            } else {
                productEntity.setAuthors(new HashSet<>());
            }
            if (productRequest.getPublisherId() != null) {
                PublisherEntity publisher = publisherRepository.findById(productRequest.getPublisherId())
                        .orElseThrow(() -> new ServiceException(ErrorCodeConst.NOT_FOUND_PUBLISHER, "Nhà xuất bản không tồn tại."));
                productEntity.setPublisher(publisher);
            } else {
                productEntity.setPublisher(null);
            }
            if (productRequest.getDistributorId() != null) {
                DistributorEntity distributor = distributorRepository.findById(productRequest.getDistributorId())
                        .orElseThrow(() -> new ServiceException(ErrorCodeConst.NOT_FOUND_DISTRIBUTOR, "Nhà phát hành không tồn tại."));
                productEntity.setDistributor(distributor);
            } else {
                productEntity.setDistributor(null);
            }
            this.removeImageInPro(productRequest);
            ProductEntity savedProductEntity = productRepository.saveAndFlush(productEntity);
            if (files != null && !files.isEmpty()) {
                List<ImageEntity> imageEntities = new ArrayList<>();
                UserEntity finalCurrentUser = currentUser;
                for (MultipartFile modelFile : files) {
                    if (modelFile == null || modelFile.isEmpty()) {
                        continue;
                    }
                    String imageUrl = handleImageService.saveFileImage(modelFile);
                    if (StringUtils.hasText(imageUrl)) {
                        ImageEntity imageEntity = new ImageEntity();
                        imageEntity.setImageUrl(imageUrl);
                        imageEntity.setStatus(1);
                        imageEntity.setIsDeleted(0);
                        Integer imgCreatedBy = (savedProductEntity.getCreatedBy() != null) ? savedProductEntity.getCreatedBy() : (finalCurrentUser != null ? finalCurrentUser.getId() : null);
                        imageEntity.setCreatedBy(imgCreatedBy);
                        imageEntity.setUpdateBy(finalCurrentUser != null ? finalCurrentUser.getId() : null);
                        imageEntity.setProductEntity(savedProductEntity);
                        imageEntities.add(imageEntity);
                    }
                }
                if (!imageEntities.isEmpty()) {
                    imageRepository.saveAllAndFlush(imageEntities);
                }
            }
            ProductEntity finalProductEntityWithImages = productRepository.findById(savedProductEntity.getId())
                    .orElseThrow(() -> new ServiceException(ErrorCodeConst.INTERNAL_SERVER_ERROR, "Lỗi nghiêm trọng: Không tìm thấy sản phẩm sau khi lưu."));
            ProductModel enrichedProductModel = enrichProductModelWithPrice(finalProductEntityWithImages, LocalDateTime.now());
            response.successResponse(enrichedProductModel, successMessage);
            return response;
        } catch (ServiceException se) {
            log.error("ServiceException trong addOrChangeProduct cho sản phẩm '{}': {}", productRequest.getName(), se.getMessage(), se);
            response.errorResponse(se.getMessage());
            return response;
        } catch (Exception e) {
            log.error("Lỗi không xác định trong addOrChangeProduct cho sản phẩm '{}': ", productRequest.getName(), e);
            response.errorResponse("Đã có lỗi không mong muốn xảy ra trên server.");
            return response;
        }
    }

    private void removeImageInPro(ProductRequest productRequest) {
        if (productRequest.getId() != null && productRequest.getFiles() != null) {
            List<ImageDTO> imagesInRequest = productRequest.getFiles();
            if (imagesInRequest != null) {
                for (ImageDTO dto : imagesInRequest) {
                    if (dto != null && dto.getId() != null && dto.getIsDeleted() != null && dto.getIsDeleted() == 1) {
                        imageRepository.updateImages(dto.getId(), dto.getIsDeleted());
                    }
                }
            }
        }
    }

    @Override
    public BaseResponseModel<Integer> deleteProduct(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            ProductEntity productEntity = productRepository.findById(id)
                    .orElseThrow(() -> new ServiceException(ErrorCodeConst.NOT_FOUND_PRODUCT, "Không tìm thấy sản phẩm."));
            productRepository.updateStatus(id, status);
            response.successResponse(id, "Cập nhật trạng thái sản phẩm thành công.");
        } catch (ServiceException se) {
            response.errorResponse(se.getMessage());
        } catch (Exception e) {
            log.error("Lỗi khi xóa sản phẩm ID {}: ", id, e);
            response.errorResponse("Lỗi không mong muốn khi xóa sản phẩm.");
        }
        return response;
    }

    @Override
    public BaseResponseModel<ProductModel> getProductById(Integer id) {
        BaseResponseModel<ProductModel> response = new BaseResponseModel<>();
        try {
            ProductEntity productEntity = productRepository.findById(id)
                    .orElseThrow(() -> new ServiceException(ErrorCodeConst.NOT_FOUND_PRODUCT, "Không tìm thấy sản phẩm với ID: " + id));
            ProductModel productModel = enrichProductModelWithPrice(productEntity, LocalDateTime.now());
            Integer soldQuantity = orderDetailRepository.calculateSoldQuantityForProduct(productEntity.getId(), COMPLETED_ORDER_STATUS);
            productModel.setSoldQuantity(soldQuantity != null ? soldQuantity : 0);
            response.successResponse(productModel, "Lấy thông tin sản phẩm thành công.");
        } catch (ServiceException se) {
            response.errorResponse(se.getMessage());
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin sản phẩm với ID {}: ", id, e);
            response.errorResponse("Đã xảy ra lỗi: " + e.getMessage());
        }
        return response;
    }

    @Override
    public BaseListResponseModel<ProductModel> getListProduct(
            Integer categoryId, Integer typeId, String keySearch,
            Integer status, Float minPrice, Float maxPrice, Pageable pageable) {
        BaseListResponseModel<ProductModel> response = new BaseListResponseModel<>();
        try {
            Page<ProductEntity> entityPage = productRepository.getListProduct(
                    keySearch, categoryId, typeId, status, minPrice, maxPrice, pageable
            );
            List<ProductModel> models;
            long totalElements = 0;
            LocalDateTime now = LocalDateTime.now();
            if (entityPage != null && entityPage.hasContent()) {
                totalElements = entityPage.getTotalElements();
                models = entityPage.getContent().stream()
                        .map(entity -> enrichProductModelWithPrice(entity, now))
                        .collect(Collectors.toList());
            } else {
                models = Collections.emptyList();
            }
            int currentPageIndex = pageable.getPageNumber() + 1;
            int currentPageSize = pageable.getPageSize();
            if (models.isEmpty()) {
                response.successResponse(Collections.emptyList(), 0, "Không tìm thấy sản phẩm nào phù hợp.", currentPageIndex, currentPageSize);
            } else {
                response.successResponse(models, (int) totalElements, "Lấy danh sách sản phẩm thành công.", currentPageIndex, currentPageSize);
            }
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách sản phẩm: ", e);
            response.errorResponse("Đã xảy ra lỗi: " + e.getMessage(),
                    pageable.getPageNumber() + 1,
                    pageable.getPageSize());
        }
        return response;
    }

    @Override
    public BaseResponseModel<String> generateCode(Integer idx) {
        BaseResponseModel<String> response = new BaseResponseModel<>();
        try {
            Integer idLastest = productRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 0 : idLastest;
            String codeGender = utilService.getGenderCode("PRO", idLastest + 1 + (idx != null ? idx : 0) );
            response.successResponse(codeGender, "Tạo mã sản phẩm thành công");
        } catch (Exception e) {
            log.error("Lỗi khi tạo mã sản phẩm: ", e);
            response.errorResponse("Lỗi khi tạo mã sản phẩm: " + e.getMessage());
        }
        return response;
    }

    @Override
    public BaseResponseModel<List<ProductModel>> getSellingBest() {
        BaseResponseModel<List<ProductModel>> response = new BaseResponseModel<>();
        try {
            List<ProductEntity> productEntities = productRepository.getListProductSellingBest();
            if (productEntities == null || productEntities.isEmpty()) {
                response.successResponse(Collections.emptyList(), "Không có sản phẩm bán chạy nào.");
                return response;
            }
            LocalDateTime now = LocalDateTime.now();
            List<ProductModel> models = productEntities.stream()
                    .map(entity -> {
                        ProductModel model = enrichProductModelWithPrice(entity, now);
                        Integer soldQuantity = orderDetailRepository.calculateSoldQuantityForProduct(entity.getId(), COMPLETED_ORDER_STATUS);
                        model.setSoldQuantity(soldQuantity != null ? soldQuantity : 0);
                        return model;
                    })
                    .collect(Collectors.toList());
            response.successResponse(models, "Lấy danh sách sản phẩm bán chạy thành công.");
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách sản phẩm bán chạy: ", e);
            response.errorResponse("Đã xảy ra lỗi: " + e.getMessage());
        }
        return response;
    }

    @Override
    public BaseResponseModel<List<ProductModel>> getRunningOut() {
        BaseResponseModel<List<ProductModel>> response = new BaseResponseModel<>();
        try {
            List<ProductEntity> productEntities = productRepository.getListProductRunningOut();
            if (productEntities == null || productEntities.isEmpty()) {
                response.successResponse(Collections.emptyList(), "Không có sản phẩm nào sắp hết hàng.");
                return response;
            }
            LocalDateTime now = LocalDateTime.now();
            List<ProductModel> models = productEntities.stream()
                    .map(entity -> {
                        ProductModel model = enrichProductModelWithPrice(entity, now);
                        Integer soldQuantity = orderDetailRepository.calculateSoldQuantityForProduct(entity.getId(), COMPLETED_ORDER_STATUS);
                        model.setSoldQuantity(soldQuantity != null ? soldQuantity : 0);
                        return model;
                    })
                    .collect(Collectors.toList());
            response.successResponse(models, "Lấy danh sách sản phẩm sắp hết hàng thành công.");
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách sản phẩm sắp hết hàng: ", e);
            response.errorResponse("Đã xảy ra lỗi: " + e.getMessage());
        }
        return response;
    }

    @Override
    public byte[] exportProductsToExcel(String keySearch, Integer categoryId, Float minPrice, Float maxPrice, Integer typeId, Integer status) throws IOException {
        List<ProductEntity> productEntities = productRepository.findAllProductsForExport(keySearch, categoryId, typeId, status, minPrice, maxPrice);
        List<ProductModel> productModels = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        if (!CollectionUtils.isEmpty(productEntities)) {
            for (ProductEntity productEntity : productEntities) {
                ProductModel model = enrichProductModelWithPrice(productEntity, now);
                Integer soldQuantity = orderDetailRepository.calculateSoldQuantityForProduct(productEntity.getId(), COMPLETED_ORDER_STATUS);
                model.setSoldQuantity(soldQuantity != null ? soldQuantity : 0);
                productModels.add(model);
            }
        }
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Danh sách sản phẩm");
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "STT", "Hình ảnh (URL)", "Mã sản phẩm", "Tên sản phẩm", "Tác giả", "Nhà XB", "Nhà PH",
                    "Giá gốc", "Giá bán (sau KM)", "Số lượng tồn", "Danh mục",
                    "Loại sản phẩm", "Trạng thái", "Đã bán"
            };
            CellStyle headerCellStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
            headerCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerCellStyle);
            }
            CellStyle currencyCellStyle = workbook.createCellStyle();
            DataFormat dataFormat = workbook.createDataFormat();
            currencyCellStyle.setDataFormat(dataFormat.getFormat("#,##0 \"₫\""));
            int rowNum = 1;
            for (ProductModel product : productModels) {
                Row row = sheet.createRow(rowNum++);
                int cellNum = 0;
                row.createCell(cellNum++).setCellValue(rowNum - 1);
                String imageUrl = (product.getImages() != null && !product.getImages().isEmpty() && product.getImages().get(0) != null && StringUtils.hasText(product.getImages().get(0).getImageUrl())) ? product.getImages().get(0).getImageUrl() : "N/A";
                row.createCell(cellNum++).setCellValue(imageUrl);
                row.createCell(cellNum++).setCellValue(product.getCode());
                row.createCell(cellNum++).setCellValue(product.getName());
                String authors = (product.getAuthors() != null && !product.getAuthors().isEmpty()) ? product.getAuthors().stream().map(am -> am.getName()).collect(Collectors.joining(", ")) : "N/A";
                row.createCell(cellNum++).setCellValue(authors);
                row.createCell(cellNum++).setCellValue(product.getPublisherInfo() != null ? product.getPublisherInfo().getName() : "N/A");
                row.createCell(cellNum++).setCellValue(product.getDistributorInfo() != null ? product.getDistributorInfo().getName() : "N/A");
                Cell originalPriceCell = row.createCell(cellNum++);
                originalPriceCell.setCellValue(product.getOriginalPrice() != null ? product.getOriginalPrice() : 0);
                originalPriceCell.setCellStyle(currencyCellStyle);
                Cell finalPriceCell = row.createCell(cellNum++);
                finalPriceCell.setCellValue(product.getFinalPrice() != null ? product.getFinalPrice() : 0);
                finalPriceCell.setCellStyle(currencyCellStyle);
                row.createCell(cellNum++).setCellValue(product.getStock() != null ? product.getStock() : 0);
                row.createCell(cellNum++).setCellValue(product.getCategoryName() != null ? product.getCategoryName() : "N/A");
                row.createCell(cellNum++).setCellValue(product.getTypeName() != null ? product.getTypeName() : "N/A");
                row.createCell(cellNum++).setCellValue(product.getStatus() != null && product.getStatus() == 1 ? "Hoạt động" : "Không hoạt động");
                row.createCell(cellNum++).setCellValue(product.getSoldQuantity() != null ? product.getSoldQuantity() : 0);
            }
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            workbook.write(baos);
            return baos.toByteArray();
        } catch (IOException e) {
            log.error("Lỗi IOException khi tạo hoặc ghi file Excel: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Lỗi không xác định khi xuất Excel: {}", e.getMessage(), e);
            throw new IOException("Lỗi không mong muốn khi tạo file Excel: " + e.getMessage(), e);
        }
    }

    @Override
    public ExcelImportResult readExcelWithImages(MultipartFile file) throws IOException {
        List<ExcelRowError> rowErrors = new ArrayList<>();
        int successfullyImportedCount = 0;
        int totalRowsProcessed = 0;
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        UserEntity currentUser = getUserEntity();
        try (XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream())) {
            XSSFSheet sheet = workbook.getSheetAt(0);
            if (sheet == null) {
                throw new IOException("Không tìm thấy sheet dữ liệu trong file Excel.");
            }
            XSSFDrawing drawing = sheet.getDrawingPatriarch();
            List<XSSFShape> shapes = new ArrayList<>();
            if (drawing != null) {
                for (XSSFShape shape : drawing) {
                    shapes.add(shape);
                }
            }
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                XSSFRow row = sheet.getRow(i);
                if (row == null || row.getCell(COL_TEN_SAN_PHAM) == null || !StringUtils.hasText(getCellValueAsString(row.getCell(COL_TEN_SAN_PHAM)))) {
                    continue;
                }
                totalRowsProcessed++;
                int currentRowNumForReport = i + 1;
                List<String> currentErrorMessages = new ArrayList<>();
                ProductEntity productToSave = new ProductEntity();
                String productNameAttempted = getCellValueAsString(row.getCell(COL_TEN_SAN_PHAM));
                try {
                    String name = productNameAttempted.trim();
                    if (!StringUtils.hasText(name)) {
                        currentErrorMessages.add("Tên sản phẩm không được để trống.");
                    } else {
                        Optional<ProductEntity> existingProduct = productRepository.findByNameExactly(name);
                        if (existingProduct.isPresent()) {
                            currentErrorMessages.add("Tên sản phẩm '" + name + "' đã tồn tại.");
                        }
                        productToSave.setName(name);
                    }
                    String priceStr = getCellValueAsString(row.getCell(COL_GIA_BAN));
                    if (!StringUtils.hasText(priceStr)) {
                        currentErrorMessages.add("Giá bán không được để trống.");
                    } else {
                        try {
                            productToSave.setPrice(Float.parseFloat(priceStr.replace(",", "")));
                            if (productToSave.getPrice() <= 0) currentErrorMessages.add("Giá bán phải là số dương.");
                        } catch (NumberFormatException e) {
                            currentErrorMessages.add("Giá bán không phải là số hợp lệ.");
                        }
                    }
                    String stockStr = getCellValueAsString(row.getCell(COL_SO_LUONG_TON));
                    if (!StringUtils.hasText(stockStr)) {
                        currentErrorMessages.add("Số lượng tồn không được để trống.");
                    } else {
                        try {
                            int stock = Integer.parseInt(stockStr);
                            if (stock < 0) currentErrorMessages.add("Số lượng tồn không được âm.");
                            productToSave.setStock(stock);
                        } catch (NumberFormatException e) {
                            currentErrorMessages.add("Số lượng tồn không phải là số nguyên hợp lệ.");
                        }
                    }
                    String categoryIdStr = getCellValueAsString(row.getCell(COL_MA_DANH_MUC_ID));
                    if (!StringUtils.hasText(categoryIdStr)) {
                        currentErrorMessages.add("Mã danh mục (ID) không được để trống.");
                    } else {
                        try {
                            int categoryId = Integer.parseInt(categoryIdStr);
                            CategoryEntity category = categoryRepository.findById(categoryId).orElse(null);
                            if (category == null) currentErrorMessages.add("Mã danh mục (ID) '" + categoryId + "' không tồn tại.");
                            productToSave.setCategoryEntity(category);
                        } catch (NumberFormatException e) {
                            currentErrorMessages.add("Mã danh mục (ID) không phải là số nguyên hợp lệ.");
                        }
                    }
                    String typeIdStr = getCellValueAsString(row.getCell(COL_MA_LOAI_ID));
                    if (!StringUtils.hasText(typeIdStr)) {
                        currentErrorMessages.add("Mã loại (ID) không được để trống.");
                    } else {
                        try {
                            int typeId = Integer.parseInt(typeIdStr);
                            TypeEntity type = typeRepository.findById(typeId).orElse(null);
                            if (type == null) currentErrorMessages.add("Mã loại (ID) '" + typeId + "' không tồn tại.");
                            productToSave.setTypeEntity(type);
                        } catch (NumberFormatException e) {
                            currentErrorMessages.add("Mã loại (ID) không phải là số nguyên hợp lệ.");
                        }
                    }
                    String statusStr = getCellValueAsString(row.getCell(COL_TRANG_THAI));
                    if (!StringUtils.hasText(statusStr)) {
                        currentErrorMessages.add("Trạng thái không được để trống.");
                    } else {
                        try {
                            int status = Integer.parseInt(statusStr);
                            if (status != 0 && status != 1) currentErrorMessages.add("Trạng thái không hợp lệ (phải là 0 hoặc 1).");
                            productToSave.setStatus(status);
                        } catch (NumberFormatException e) {
                            currentErrorMessages.add("Trạng thái không phải là số hợp lệ.");
                        }
                    }
                    productToSave.setDescription(getCellValueAsString(row.getCell(COL_MO_TA)));
                    String datePublishStr = getCellValueAsString(row.getCell(COL_NGAY_XUAT_BAN));
                    if (StringUtils.hasText(datePublishStr)) {
                        try {
                            productToSave.setDatePublish(LocalDate.parse(datePublishStr, dateFormatter));
                        } catch (DateTimeParseException e) {
                            currentErrorMessages.add("Ngày xuất bản '" + datePublishStr + "' không đúng định dạng YYYY-MM-DD.");
                        }
                    }
                    String datePublicStr = getCellValueAsString(row.getCell(COL_NGAY_PHAT_HANH));
                    if (StringUtils.hasText(datePublicStr)) {
                        try {
                            productToSave.setDatePublic(LocalDate.parse(datePublicStr, dateFormatter));
                        } catch (DateTimeParseException e) {
                            currentErrorMessages.add("Ngày phát hành '" + datePublicStr + "' không đúng định dạng YYYY-MM-DD.");
                        }
                    }
                    String authorIdsStr = getCellValueAsString(row.getCell(COL_TAC_GIA_IDS));
                    if (StringUtils.hasText(authorIdsStr)) {
                        try {
                            List<Integer> authorIds = Arrays.stream(authorIdsStr.split(","))
                                    .map(String::trim)
                                    .map(Integer::parseInt)
                                    .collect(Collectors.toList());
                            if (!authorIds.isEmpty()) {
                                List<AuthorEntity> authors = authorRepository.findByIdIn(authorIds);
                                if (authors.size() != authorIds.size()) {
                                    currentErrorMessages.add("Một hoặc nhiều ID tác giả không tồn tại: " + authorIdsStr);
                                }
                                productToSave.setAuthors(new HashSet<>(authors));
                            }
                        } catch (NumberFormatException e) {
                            currentErrorMessages.add("Danh sách ID tác giả không hợp lệ: " + authorIdsStr);
                        }
                    }
                    String publisherIdStr = getCellValueAsString(row.getCell(COL_NHA_XUAT_BAN_ID));
                    if (StringUtils.hasText(publisherIdStr)) {
                        try {
                            int publisherId = Integer.parseInt(publisherIdStr);
                            PublisherEntity publisher = publisherRepository.findById(publisherId).orElse(null);
                            if (publisher == null) {
                                currentErrorMessages.add("ID nhà xuất bản không tồn tại: " + publisherIdStr);
                            }
                            productToSave.setPublisher(publisher);
                        } catch (NumberFormatException e) {
                            currentErrorMessages.add("ID nhà xuất bản không phải là số hợp lệ: " + publisherIdStr);
                        }
                    }
                    String distributorIdStr = getCellValueAsString(row.getCell(COL_NHA_PHAT_HANH_ID));
                    if (StringUtils.hasText(distributorIdStr)) {
                        try {
                            int distributorId = Integer.parseInt(distributorIdStr);
                            DistributorEntity distributor = distributorRepository.findById(distributorId).orElse(null);
                            if (distributor == null) {
                                currentErrorMessages.add("ID nhà phát hành không tồn tại: " + distributorIdStr);
                            }
                            productToSave.setDistributor(distributor);
                        } catch (NumberFormatException e) {
                            currentErrorMessages.add("ID nhà phát hành không phải là số hợp lệ: " + distributorIdStr);
                        }
                    }
                    if (currentErrorMessages.isEmpty()) {
                        Integer lastId = productRepository.getIdGenerateCode();
                        productToSave.setCode(utilService.getGenderCode("PRO", (lastId == null ? 0 : lastId) + 1 + i));
                        productToSave.setCreatedBy(currentUser.getId());
                        productToSave.setUpdatedBy(currentUser.getId());
                        productToSave.setIsDeleted(0);
                        ProductEntity savedProduct = productRepository.save(productToSave);
                        successfullyImportedCount++;
                        String imgUrlFromExcel = this.extractImageForCell(shapes, row.getRowNum(), COL_HINH_ANH);
                        if (StringUtils.hasText(imgUrlFromExcel)) {
                            ImageEntity imageEntity = new ImageEntity();
                            imageEntity.setImageUrl(imgUrlFromExcel);
                            imageEntity.setStatus(1);
                            imageEntity.setIsDeleted(0);
                            imageEntity.setCreatedBy(currentUser.getId());
                            imageEntity.setUpdateBy(currentUser.getId());
                            imageEntity.setProductEntity(savedProduct);
                            imageRepository.save(imageEntity);
                        }
                    } else {
                        rowErrors.add(new ExcelRowError(currentRowNumForReport, productNameAttempted, currentErrorMessages));
                    }
                } catch (Exception e) {
                    log.error("Lỗi không mong muốn khi xử lý dòng {} trong Excel: {}", currentRowNumForReport, e.getMessage(), e);
                    currentErrorMessages.add("Lỗi hệ thống khi xử lý dòng này: " + e.getMessage());
                    rowErrors.add(new ExcelRowError(currentRowNumForReport, productNameAttempted, currentErrorMessages));
                }
            }
        } catch (IOException e) {
            log.error("Lỗi khi đọc file Excel: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Lỗi không xác định trong quá trình nhập Excel: {}", e.getMessage(), e);
            throw new IOException("Lỗi không xác định trong quá trình nhập Excel: " + e.getMessage(), e);
        }
        return new ExcelImportResult(totalRowsProcessed, successfullyImportedCount, totalRowsProcessed - successfullyImportedCount, rowErrors);
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        String cellValue = "";
        try {
            switch (cell.getCellType()) {
                case STRING:
                    cellValue = cell.getStringCellValue().trim();
                    break;
                case NUMERIC:
                    if (DateUtil.isCellDateFormatted(cell)) {
                        LocalDateTime ldt = cell.getLocalDateTimeCellValue();
                        if (ldt != null) {
                            cellValue = ldt.toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
                        }
                    } else {
                        double numValue = cell.getNumericCellValue();
                        if (numValue == (long) numValue) {
                            cellValue = String.format("%d", (long) numValue);
                        } else {
                            cellValue = String.valueOf(numValue).replace(".0", "");
                        }
                    }
                    break;
                case BOOLEAN:
                    cellValue = String.valueOf(cell.getBooleanCellValue());
                    break;
                case FORMULA:
                    FormulaEvaluator evaluator = cell.getSheet().getWorkbook().getCreationHelper().createFormulaEvaluator();
                    CellValue evaluatedCellValue = evaluator.evaluate(cell);
                    switch (evaluatedCellValue.getCellType()) {
                        case STRING: cellValue = evaluatedCellValue.getStringValue().trim(); break;
                        case NUMERIC:
                            if (DateUtil.isCellDateFormatted(cell)) {
                                LocalDateTime ldt = cell.getLocalDateTimeCellValue();
                                if (ldt != null) cellValue = ldt.toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
                            } else {
                                double numValue = evaluatedCellValue.getNumberValue();
                                if (numValue == (long) numValue) cellValue = String.format("%d", (long) numValue);
                                else cellValue = String.valueOf(numValue).replace(".0", "");
                            }
                            break;
                        case BOOLEAN: cellValue = String.valueOf(evaluatedCellValue.getBooleanValue()); break;
                        default: break;
                    }
                    break;
                default:
                    break;
            }
        } catch (Exception e) {
            log.warn("Không thể đọc giá trị cell tại hàng {}, cột {}: {}", cell.getRowIndex(), cell.getColumnIndex(), e.getMessage());
            return "";
        }
        return cellValue;
    }

    private void saveImages(List<ProductEntity> dataList, Map<String, String> mapCodeProAndImgId) {
        Map<String, ProductEntity> mapPro = dataList.stream().collect(Collectors.toMap(ProductEntity::getCode, Function.identity()));
        List<ImageEntity> imageEntities = new ArrayList<>();
        UserEntity currentUser = getUserEntity();
        for (Map.Entry<String, String> entry : mapCodeProAndImgId.entrySet()) {
            String urlImg = entry.getValue();
            if (!StringUtils.hasText(urlImg)) continue;
            ImageEntity imageEntity = new ImageEntity();
            imageEntity.setImageUrl(urlImg);
            imageEntity.setStatus(1);
            imageEntity.setIsDeleted(0);
            imageEntity.setCreatedBy(currentUser.getId());
            imageEntity.setUpdateBy(currentUser.getId());
            ProductEntity productForImage = mapPro.get(entry.getKey());
            if (productForImage != null) {
                imageEntity.setProductEntity(productForImage);
                imageEntities.add(imageEntity);
            } else {
                log.warn("Không tìm thấy sản phẩm với code {} để gán ảnh {}", entry.getKey(), urlImg);
            }
        }
        if (!imageEntities.isEmpty()) {
            try {
                imageRepository.saveAllAndFlush(imageEntities);
            } catch (Exception e) {
                log.error("Lỗi khi lưu danh sách ImageEntity từ Excel: {}", e.getMessage(), e);
            }
        }
    }

    private String extractImageForCell(List<XSSFShape> shapes, int rowIndex, int colIndex) throws IOException {
        if (shapes == null) return null;
        for (XSSFShape shape : shapes) {
            if (shape instanceof XSSFPicture) {
                XSSFPicture picture = (XSSFPicture) shape;
                ClientAnchor anchor = picture.getPreferredSize();
                if (anchor != null && anchor.getRow1() == rowIndex && anchor.getCol1() == colIndex) {
                    XSSFPictureData pictureData = picture.getPictureData();
                    if (pictureData != null) {
                        return this.saveImage(pictureData, rowIndex + "_" + colIndex);
                    }
                }
            }
        }
        return null;
    }

    private String saveImage(XSSFPictureData pictureData, String imageIdentifier) throws IOException {
        byte[] imageData = pictureData.getData();
        String extension = pictureData.suggestFileExtension().toLowerCase().replaceAll("[^a-z0-9]", "");
        if (!StringUtils.hasText(extension)) {
            extension = "png";
        }
        String uniqueFileName = String.format("excel_import_%s_img%d.%s", imageIdentifier, System.currentTimeMillis(), extension);
        Path outputPath = Paths.get(saveImagePath, uniqueFileName);
        java.io.File parentDir = outputPath.getParent().toFile();
        if (!parentDir.exists()) {
            parentDir.mkdirs();
        }
        try (FileOutputStream fos = new FileOutputStream(outputPath.toFile())) {
            fos.write(imageData);
        }
        String imageUrl = "/uploads/" + uniqueFileName;
        return imageUrl;
    }
}