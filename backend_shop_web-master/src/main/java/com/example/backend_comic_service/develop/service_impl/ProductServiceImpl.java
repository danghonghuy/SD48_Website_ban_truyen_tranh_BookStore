package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.*;
import com.example.backend_comic_service.develop.exception.ServiceException;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.dto.DiscountDTO;
import com.example.backend_comic_service.develop.model.dto.ImageDTO;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
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

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
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

    @Value("${com.develop.path-save-image}")
    private String saveImagePath;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, UtilService utilService, ProductValidator productValidator, CategoryRepository categoryRepository, TypeRepository typeRepository, UserRepository userRepository, HandleImageService handleImageService, ImageRepository imageRepository, DiscountRepository discountRepository) {
        this.productRepository = productRepository;
        this.utilService = utilService;
        this.productValidator = productValidator;
        this.categoryRepository = categoryRepository;
        this.typeRepository = typeRepository;
        this.userRepository = userRepository;
        this.handleImageService = handleImageService;
        this.imageRepository = imageRepository;
        this.discountRepository = discountRepository;
    }

    @Override
    public BaseResponseModel<ProductModel> addOrChangeProduct(ProductRequest productModel, List<MultipartFile> files) {
        BaseResponseModel<ProductModel> response = new BaseResponseModel<>();
        try {
            String errorMessage = productValidator.validate(productModel);
            if (StringUtils.hasText(errorMessage)) {
                response.errorResponse(errorMessage);
                return response;
            }
            ProductEntity entityByName = productRepository.findByName(productModel.getName().replaceAll("\\s+", " ").trim());
            if (entityByName != null && !entityByName.getId().equals(productModel.getId())) {
                response.errorResponse("Tên sản phẩm đã tồn tại !");
                return response;
            }

            ProductEntity entity = productModel.toEntity();
            TypeEntity typeEntity = typeRepository.findById(productModel.getTypeId()).orElse(null);
            if (typeEntity == null) {
                response.errorResponse("Gói bán không tồn tại");
                return response;
            }
            CategoryEntity categoryEntity = categoryRepository.findById(productModel.getCategoryId()).orElse(null);
            if (categoryEntity == null) {
                response.errorResponse("Thể loại không tồn tại");
                return response;
            }
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                UserEntity userCreate = userRepository.findUserEntitiesByUserNameAndStatus(username, 1).orElse(null);
                if (userCreate == null) {
                    response.errorResponse("Người dùng không hợp lệ");
                    return response;
                }
                if (Optional.ofNullable(productModel.getId()).orElse(0) == 0) {
                    entity.setCreatedBy(userCreate.getId());
                    entity.setCreatedDate(LocalDateTime.now());
                }
                entity.setUpdatedBy(userCreate.getId());
                entity.setUpdatedDate(LocalDateTime.now());
            } catch (Exception e) {
                log.error(e.getMessage());
                response.errorResponse(e.getMessage());
                return response;
            }
            entity.setTypeEntity(typeEntity);
            entity.setCategoryEntity(categoryEntity);
            this.removeImageInPro(productModel);
            ProductEntity productEntity = productRepository.saveAndFlush(entity);
            if (productEntity.getId() != null) {
                if (files != null && !files.isEmpty()) {
                    List<ImageEntity> imageEntities = new ArrayList<>();
                    files.forEach(model -> {
                        ImageEntity imageEntity = new ImageEntity();
                        String imageUrl = handleImageService.saveFileImage(model);
                        if (StringUtils.hasText(imageUrl)) {
                            imageEntity.setImageUrl(imageUrl);
                            imageEntity.setStatus(1);
                            imageEntity.setIsDeleted(0);
                            imageEntity.setCreatedBy(productEntity.getCreatedBy());
                            imageEntity.setUpdateBy(productEntity.getUpdatedBy());
                            imageEntity.setCreatedDate(LocalDateTime.now());
                            imageEntity.setUpdateDate(LocalDateTime.now());
                            imageEntity.setProductEntity(productEntity);
                            imageEntities.add(imageEntity);
                        }
                    });
                    if (!imageEntities.isEmpty()) {
                        imageRepository.saveAllAndFlush(imageEntities);
                    }
                }
                response.successResponse(entity.toProductModel(), "Sửa thành công");
                return response;
            }
            response.errorResponse("Thất bại");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    private void removeImageInPro(ProductRequest productModel) {
        List<ImageDTO> images = productModel.getFiles();
        if (images != null) {
            for (ImageDTO dto : images) {
                if (dto.getIsDeleted() == 1) {
                    imageRepository.updateImages(dto.getId(), dto.getIsDeleted());
                }
            }
        }
    }

    @Override
    public BaseResponseModel<Integer> deleteProduct(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            ProductEntity productEntity = productRepository.findById(id).orElse(null);
            if (productEntity == null) {
                response.errorResponse("Không tìm thấy sản phẩm");
                return response;
            }
            productRepository.updateStatus(id, status);
            response.successResponse(id, "Xóa sản phẩm thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<ProductModel> getProductById(Integer id) {
        BaseResponseModel<ProductModel> response = new BaseResponseModel<>();
        try {
            ProductEntity productEntity = productRepository.findById(id).orElse(null);
            if (productEntity == null) {
                response.errorResponse("Không tìm thấy sản phẩm");
                return response;
            }
            ProductModel productModel = productEntity.toProductModel();
            List<DiscountEntity> discountEntities = discountRepository.getDiscountEntitiesByProductId(productEntity.getId());
            if (!CollectionUtils.isEmpty(discountEntities)) {
                DiscountDTO discountModel = discountEntities.get(0).toDiscountDTO();
                productModel.setDiscountDTO(discountModel);
            }
            response.successResponse(productModel, "Success");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<List<ProductModel>> getListProduct(Integer categoryId, Integer typeId, String keySearch,
                                                                    Integer status, Float minPrice, Float maxPrice, Pageable pageable) {
        BaseListResponseModel<List<ProductModel>> response = new BaseListResponseModel<>();
        try {
            Page<ProductEntity> entityList = productRepository.getListProduct(keySearch, categoryId, typeId, status, minPrice, maxPrice, pageable);
            if (entityList == null) {
                response.errorResponse("Danh sách sản phẩm trống");
                return response;
            }
            List<ProductModel> models = new ArrayList<>();
            for (ProductEntity product : entityList) {
                List<DiscountEntity> discountEntities = discountRepository.getDiscountEntitiesByProductId(product.getId());
                ProductModel model = product.toProductModel();
                if (!discountEntities.isEmpty()) {
                    DiscountDTO discountModel = discountEntities.get(0).toDiscountDTO();
                    model.setDiscountDTO(discountModel);
                }
                models.add(model);
            }
            response.successResponse(models, "Thành công");
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
    public BaseResponseModel<String> generateCode(Integer idx) {
        BaseResponseModel<String> response = new BaseResponseModel<>();
        try {
            Integer idLastest = productRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("PRO", idLastest + idx);
            response.successResponse(codeGender, "Tạo mã sản phẩm thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<List<ProductModel>> getSellingBest() {
        BaseResponseModel<List<ProductModel>> response = new BaseResponseModel<>();

        List<ProductEntity> productEntities = productRepository.getListProductSellingBest();
        List<ProductModel> models = productEntities.stream().map(ProductEntity::toProductModel).toList();
        response.setData(models);
        return response;
    }

    @Override
    public BaseResponseModel<List<ProductModel>> getRunningOut() {
        BaseResponseModel<List<ProductModel>> response = new BaseResponseModel<>();

        List<ProductEntity> productEntities = productRepository.getListProductRunningOut();
        List<ProductModel> models = productEntities.stream().map(ProductEntity::toProductModel).toList();
        response.setData(models);
        return response;
    }


    @Override
    public void readExcelWithImages(MultipartFile file) throws IOException {
        List<ProductEntity> dataList = new ArrayList<>();
        Map<String, String> mapCodeProAndImgId = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd['T'HH:mm]");

        try (XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream())) {
            XSSFSheet sheet = workbook.getSheetAt(0);
            XSSFDrawing drawing = sheet.getDrawingPatriarch();
            List<XSSFShape> shapes = new ArrayList<>();
            if (drawing != null) {
                for (XSSFShape shape : drawing) {
                    shapes.add(shape);
                }
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                XSSFRow row = sheet.getRow(i);
                if (row == null) continue;

                String codeProduct = "IMP_" + this.generateCode(i).getData();
                List<ProductEntity> entityByNames = productRepository.findByNames(getCellValueAsString(row.getCell(1)));
                if (entityByNames != null && entityByNames.size() > 0) {
                    continue;
                }
                ProductEntity product = new ProductEntity();
                product.setStatus(1);
                product.setCreatedBy(getUserEntity().getId());
                product.setCreatedDate(LocalDateTime.now());
                product.setCode(codeProduct);

                product.setName(getCellValueAsString(row.getCell(1)));
                CategoryEntity categoryEntity = categoryRepository.findById((int) Double.parseDouble(getCellValueAsString(row.getCell(2)))).orElseThrow(() -> new ServiceException(ErrorCodeConst.NOT_FOUND_CATEGORY, null));
                product.setCategoryEntity(categoryEntity);

                TypeEntity typeEntity = typeRepository.findById((int) Double.parseDouble(getCellValueAsString(row.getCell(3)))).orElseThrow(() -> new ServiceException(ErrorCodeConst.NOT_FOUND_TYPE, null));
                product.setTypeEntity(typeEntity);

                product.setAuthor(getCellValueAsString(row.getCell(4)));
                product.setAuthorPublish(getCellValueAsString(row.getCell(5)));
                product.setSeries(getCellValueAsString(row.getCell(6)));

                product.setPublisher(getCellValueAsString(row.getCell(7)));
                product.setDatePublish(LocalDate.parse(getCellValueAsString(row.getCell(8)), formatter));
                product.setDatePublic(LocalDate.parse(getCellValueAsString(row.getCell(9)), formatter));
                product.setPrice(Float.parseFloat(getCellValueAsString(row.getCell(10))));
                product.setStock((int) Double.parseDouble(getCellValueAsString(row.getCell(11))));
                product.setDescription(getCellValueAsString(row.getCell(12)));
                String imgUrl = this.extractImageForCell(shapes, row.getRowNum(), 13);

                mapCodeProAndImgId.put(codeProduct, imgUrl);
                if (org.apache.commons.lang3.StringUtils.isNotBlank(product.getName())) dataList.add(product);
            }
        }
        if (!dataList.isEmpty()) {
            productRepository.saveAll(dataList);
            this.saveImages(dataList, mapCodeProAndImgId);
        }
    }

    private void saveImages(List<ProductEntity> dataList, Map<String, String> mapCodeProAndImgId) {
        Map<String, ProductEntity> mapPro = dataList.stream().collect(Collectors.toMap(ProductEntity::getCode, Function.identity()));
        List<ImageEntity> imageEntities = new ArrayList<>();

        for (Map.Entry<String, String> entry : mapCodeProAndImgId.entrySet()) {
            String urlImg = entry.getValue();
            ImageEntity imageEntity = new ImageEntity();
            imageEntity.setImageUrl(urlImg);
            imageEntity.setStatus(1);
            imageEntity.setIsDeleted(0);
            imageEntity.setCreatedBy(getUserEntity().getId());
            imageEntity.setUpdateBy(getUserEntity().getId());
            imageEntity.setCreatedDate(LocalDateTime.now());
            imageEntity.setUpdateDate(LocalDateTime.now());
            imageEntity.setProductEntity(mapPro.get(entry.getKey()));
            imageEntities.add(imageEntity);
        }
        if (!imageEntities.isEmpty()) imageRepository.saveAllAndFlush(imageEntities);
    }

    private String extractImageForCell(List<XSSFShape> shapes, int rowIndex, int colIndex) throws IOException {
        for (XSSFShape shape : shapes) {
            if (shape instanceof XSSFPicture) {
                XSSFPicture picture = (XSSFPicture) shape;
                XSSFClientAnchor anchor = (XSSFClientAnchor) picture.getAnchor();
                if (anchor.getRow1() == rowIndex && anchor.getCol1() == colIndex) {
                    XSSFPictureData pictureData = picture.getPictureData();
                    return this.saveImage(pictureData, colIndex);
                }
            }
        }
        return null;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toString();
                }
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }

    private String saveImage(XSSFPictureData pictureData, int sheetIndex) throws IOException {
        LocalDateTime localDateTime = LocalDateTime.now();

        byte[] imageData = pictureData.getData();
        String extension = pictureData.suggestFileExtension();

        String fileName = String.format("sheet%d_image%d.%s", sheetIndex, System.currentTimeMillis(), extension);
        Path outputPath = Paths.get(saveImagePath, fileName);

        try (FileOutputStream fos = new FileOutputStream(outputPath.toFile())) {
            fos.write(imageData);
        }
        return "/uploads/" + localDateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli() + fileName;
    }
}
