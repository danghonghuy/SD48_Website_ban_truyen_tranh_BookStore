package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.entity.*;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.OrderDetailGetListMapper;
import com.example.backend_comic_service.develop.model.model.OrderDetailModel;
import com.example.backend_comic_service.develop.model.model.OrderModel;
import com.example.backend_comic_service.develop.repository.*;
import com.example.backend_comic_service.develop.service.IOrderDetailService;
import com.example.backend_comic_service.develop.validator.OrderDetailValidator;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class OrderDetailServiceImpl implements IOrderDetailService {
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailValidator orderDetailValidator;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CouponRepository couponRepository;
    @Autowired
    private LogActionOrderRepository logActionOrderRepository;

    @Override
    public int bulkInsertOrderDetail(List<OrderDetailModel> models, OrderEntity orderEntity, UserEntity userEntity, Integer isChangeOrder) {
        try {
            if (isChangeOrder != null && isChangeOrder == 1 && orderEntity.getId() != null) {
                log.info("Thay đổi đơn hàng ID: {}. Hoàn trả stock cho các chi tiết cũ.", orderEntity.getId());
                List<OrderDetailEntity> oldOrderDetails = orderDetailRepository.findByOrder(orderEntity); // HOẶC findByOrderEntity(orderEntity) - CHỌN 1
                List<ProductEntity> productsToSaveFromOldDetails = new ArrayList<>();

                for (OrderDetailEntity oldDetail : oldOrderDetails) {
                    ProductEntity oldProduct = oldDetail.getProduct();
                    if (oldProduct != null) {
                        int stockToReturn = oldDetail.getQuantity();
                        oldProduct.setStock(oldProduct.getStock() + stockToReturn);
                        if (oldProduct.getStock() > 0 && oldProduct.getStatus() == 0) {
                            oldProduct.setStatus(1);
                            log.info("Sản phẩm ID {} được hoàn kho khi thay đổi đơn hàng, tự động mở khóa.", oldProduct.getId());
                        }
                        if (!productsToSaveFromOldDetails.contains(oldProduct)) {
                            productsToSaveFromOldDetails.add(oldProduct);
                        }
                    }
                }
                if (!productsToSaveFromOldDetails.isEmpty()) {
                    productRepository.saveAllAndFlush(productsToSaveFromOldDetails);
                }
                if (!oldOrderDetails.isEmpty()){
                    orderDetailRepository.deleteAllInBatch(oldOrderDetails);
                }
                log.info("Đã hoàn trả stock và xóa chi tiết đơn hàng cũ cho Order ID: {}", orderEntity.getId());
            }

            List<OrderDetailEntity> orderDetailEntities = new ArrayList<>();
            List<ProductEntity> productsToUpdate = new ArrayList<>();

            if (models == null || models.isEmpty()) {
                log.info("Không có chi tiết đơn hàng nào để xử lý cho Order ID: {}", orderEntity.getId());
                return 0;
            }

            List<Integer> productIds = models.stream().map(OrderDetailModel::getProductId).distinct().toList();
            List<ProductEntity> productEntitiesFromDb = productRepository.findAllById(productIds);

            for (OrderDetailModel m : models) {
                String errorMsg = orderDetailValidator.validate(m);
                if (StringUtils.hasText(errorMsg)) {
                    log.error("Lỗi validate OrderDetailModel cho Product ID {}: {}", m.getProductId(), errorMsg);
                    return -1;
                }

                ProductEntity product = productEntitiesFromDb.stream()
                        .filter(p -> p.getId().equals(m.getProductId()))
                        .findFirst()
                        .orElse(null);

                if (product == null) {
                    log.error("Không tìm thấy sản phẩm với ID: {} trong DB.", m.getProductId());
                    return -3;
                }

                Integer currentStock = product.getStock() == null ? 0 : product.getStock();
                if (currentStock >= m.getQuantity()) {
                    int newStock = currentStock - m.getQuantity();
                    product.setStock(newStock);

                    if (newStock == 0 && product.getStatus() == 1) {
                        product.setStatus(0);
                        log.info("Sản phẩm ID {} (Code: {}) đã hết hàng (tồn kho mới: {}), tự động chuyển trạng thái sang Không hoạt động.", product.getId(), product.getCode(), newStock);
                    }
                    if (!productsToUpdate.contains(product)) {
                        productsToUpdate.add(product);
                    }

                    OrderDetailEntity object = new OrderDetailEntity();
                    object.setId(null);
                    object.setPrice(m.getPrice());
                    object.setQuantity(m.getQuantity());
                    object.setTotal((int) (m.getPrice() * m.getQuantity()));
                    object.setCreatedDate(LocalDateTime.now());
                    object.setUpdatedDate(LocalDateTime.now());
                    object.setCreatedBy(userEntity.getId());
                    object.setUpdatedBy(userEntity.getId());
                    object.setOrder(orderEntity);
                    object.setIsDeleted(0);
                    object.setStatus(1);
                    object.setProduct(product);
                    orderDetailEntities.add(object);
                } else {
                    log.info("Không đủ tồn kho cho sản phẩm: {} (Code: {}). Yêu cầu: {}, Hiện có: {}", product.getName(), product.getCode(), m.getQuantity(), currentStock);
                    return -2;
                }
            }

            if (!productsToUpdate.isEmpty()) {
                productRepository.saveAllAndFlush(productsToUpdate);
                log.info("Đã cập nhật stock và status cho {} sản phẩm.", productsToUpdate.size());
            }

            if (!orderDetailEntities.isEmpty()) {
                orderDetailRepository.saveAllAndFlush(orderDetailEntities);
                log.info("Đã lưu {} chi tiết đơn hàng cho Order ID: {}", orderDetailEntities.size(), orderEntity.getId());
                return orderDetailEntities.size();
            }
            return 0;

        } catch (Exception e) {
            log.error("Lỗi nghiêm trọng trong bulkInsertOrderDetail cho Order ID {}: {}", (orderEntity != null ? orderEntity.getId() : "UNKNOWN"), e.getMessage(), e);
            throw new RuntimeException("Lỗi khi xử lý chi tiết đơn hàng: " + e.getMessage(), e);
        }
    }

    @Override
    public BaseListResponseModel<OrderDetailGetListMapper> getListByOrderId(Integer orderId) { // Sửa tên tham số cho rõ ràng và kiểu trả về
        BaseListResponseModel<OrderDetailGetListMapper> response = new BaseListResponseModel<>();
        try {
            List<OrderDetailGetListMapper> orderDetailGetListMappers = orderDetailRepository.getListByOrderId(orderId); // Giả sử repository trả về List<DTO>

            // Vì đây không phải là danh sách phân trang từ Pageable,
            // chúng ta sẽ set các giá trị phân trang mặc định hoặc dựa trên kích thước của list.
            int totalElements = (orderDetailGetListMappers != null) ? orderDetailGetListMappers.size() : 0;
            int currentPageIndex = 1; // Mặc định trang 1
            int currentPageSize = totalElements > 0 ? totalElements : 10; // Mặc định pageSize là 10 hoặc bằng totalElements nếu có

            if (orderDetailGetListMappers == null || orderDetailGetListMappers.isEmpty()) {
                response.successResponse(new ArrayList<>(), 0, "Không tìm thấy chi tiết đơn hàng.", currentPageIndex, currentPageSize);
            } else {
                response.successResponse(orderDetailGetListMappers, totalElements, "Lấy danh sách chi tiết đơn hàng thành công.", currentPageIndex, currentPageSize);
            }
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách chi tiết đơn hàng cho orderId {}: {}", orderId, e.getMessage(), e);
            // Cung cấp giá trị mặc định cho pageIndex và pageSize khi lỗi
            response.errorResponse("Lỗi hệ thống khi lấy danh sách chi tiết đơn hàng: " + e.getMessage(), 1, 10);
        }
        return response;
    }

    @Override
    public BaseResponseModel<OrderModel> getDetail(Integer id) {
        BaseResponseModel<OrderModel> response = new BaseResponseModel<>();
        try {
            OrderEntity orderEntity = orderRepository.findById(id).orElse(null);
            if (orderEntity == null) {
                response.successResponse(null, null);
                return response;
            }

            OrderModel orderModel = orderEntity.toModel();
            List<LogActionOrderEntity> logActionOrderEntities = logActionOrderRepository.findByOrderId(orderModel.getId());

            if (!logActionOrderEntities.isEmpty()) {
                orderModel.setLogActionOrderModels(logActionOrderEntities.stream().map(LogActionOrderEntity::toModel).collect(Collectors.toList()));
            }
            if (orderModel.getCouponId() != null) {
                CouponEntity couponEntity = couponRepository.findById(orderModel.getCouponId()).orElse(null);
                if (couponEntity != null) {
                    orderModel.setCouponModel(couponEntity.toCouponModel());
                }
            }

            List<LogPaymentHistoryEntity> paymentHistoryEntities = orderEntity.getPaymentHistoryEntities();
            if (!paymentHistoryEntities.isEmpty()) {
                orderModel.setLogPaymentHistoryModels(paymentHistoryEntities.stream().map(LogPaymentHistoryEntity::toModel).collect(Collectors.toList()));
            }
            response.successResponse(orderModel, "Thành công");
            return response;
        } catch (Exception e) {
            log.error(e.getMessage());
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}