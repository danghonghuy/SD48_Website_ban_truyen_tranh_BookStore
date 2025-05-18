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

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
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
            if (isChangeOrder != null && isChangeOrder == 1) {
                productRepository.updateAddStock(orderEntity.getId());
                productRepository.deleteOrderDetail(orderEntity.getId());
            }
            List<OrderDetailEntity> orderDetailEntities = new ArrayList<>();

            List<Integer> productIds = models.stream().map(OrderDetailModel::getProductId).toList();

            List<ProductEntity> productEntities = productRepository.getListProductByIds(productIds);

            for (OrderDetailModel m : models) {
                String errorMsg = orderDetailValidator.validate(m);
                if (StringUtils.hasText(errorMsg)) {
                    return -1;
                }
                ProductEntity product = productEntities.stream().filter(p -> p.getId().equals(m.getProductId())).findFirst().orElse(null);
                if (product != null) {
                    Integer stock = product.getStock() == null ? 0 : product.getStock();
                    if (stock >= m.getQuantity()) {
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
                        log.info("product: {} - stock: {}", product.getCode(), stock);
                        return -2;
                    }
                }
            }
            orderDetailRepository.saveAllAndFlush(orderDetailEntities);

            return 1;
        } catch (Exception e) {
            orderRepository.updateOrderStatus(OrderStatusEnum.ORDER_STATUS_FAIL, orderEntity.getId());
            return -1;
        }
    }

    @Override
    public BaseListResponseModel<List<OrderDetailGetListMapper>> getListByOrderId(Integer orderIds) {
        BaseListResponseModel<List<OrderDetailGetListMapper>> response = new BaseListResponseModel<>();
        try {
            List<OrderDetailGetListMapper> orderDetailGetListMappers = orderDetailRepository.getListByOrderId(orderIds);
            if (orderDetailGetListMappers.isEmpty()) {
                response.successResponse(null, "Danh sách trống");
            }
            response.successResponse(orderDetailGetListMappers, "Thành công");
            return response;
        } catch (Exception e) {
            log.error(e.getMessage());
            response.errorResponse(e.getMessage());
            return response;
        }
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
