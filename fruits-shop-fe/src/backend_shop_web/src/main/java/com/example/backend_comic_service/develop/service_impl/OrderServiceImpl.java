package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.constants.CouponTypeEnum;
import com.example.backend_comic_service.develop.constants.ProductDiscountStatusEnum;
import com.example.backend_comic_service.develop.constants.TypeDiscountEnum;
import com.example.backend_comic_service.develop.entity.*;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.OrderGetListMapper;
import com.example.backend_comic_service.develop.model.mapper.ProductDiscountMapper;
import com.example.backend_comic_service.develop.model.model.OrderDetailModel;
import com.example.backend_comic_service.develop.model.model.OrderModel;
import com.example.backend_comic_service.develop.repository.*;
import com.example.backend_comic_service.develop.service.IOrderDetailService;
import com.example.backend_comic_service.develop.service.IOrderService;
import com.example.backend_comic_service.develop.validator.OrderValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderServiceImpl implements IOrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderValidator orderValidator;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private DeliveryRepository deliveryRepository;
    @Autowired
    private IOrderDetailService orderDetailService;
    @Autowired
    private CouponRepository couponRepository;
    @Autowired
    private ProductDiscountRepository productDiscountRepository;

    @Override
    public BaseResponseModel<Integer> createOrder(OrderModel model) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            String errorMsg = orderValidator.validate(model);
            if (StringUtils.hasText(errorMsg)) {
                response.errorResponse(errorMsg);
                return response;
            }
            UserEntity userEntity = userRepository.findUserEntitiesById(model.getUserId()).orElse(null);
            if (userEntity == null) {
                response.errorResponse("User is invalid");
                return response;
            }
            PaymentEntity paymentEntity = paymentRepository.findById(model.getPaymentId()).orElse(null);
            if (paymentEntity == null) {
                response.errorResponse("Payment is invalid");
                return response;
            }
            UserEntity employee = userRepository.findUserEntitiesById(model.getEmployeeId()).orElse(null);
            if (employee == null) {
                response.errorResponse("Employee is invalid");
                return response;
            }
            AddressEntity address = addressRepository.findById(model.getAddressId()).orElse(null);
            if (address == null) {
                response.errorResponse("Address is invalid");
                return response;
            }
            DeliveryEntity deliveryEntity = deliveryRepository.findById(model.getDeliveryType()).orElse(null);
            if (deliveryEntity == null) {
                response.errorResponse("Delivery type is invalid");
                return response;
            }
            double sumPriceOrder = 0;
            if (model.getOrderDetailModels().isEmpty()) {
                response.errorResponse("Order not exist product ");
                return response;
            }
            List<Integer> productIds = model.getOrderDetailModels().stream().map(OrderDetailModel::getProductId).toList();
            List<ProductDiscountMapper> productDiscountMappers = productDiscountRepository.getProductDiscountByProductId(productIds);
            if (!productDiscountMappers.isEmpty()) {
                List<OrderDetailModel> orderDetailModels = model.getOrderDetailModels().stream().peek(item -> {
                    Optional<ProductDiscountMapper> productDiscountMapper = productDiscountMappers.stream().filter(e -> e.getProductId().equals(item.getProductId())).findFirst();
                    if (productDiscountMapper.isPresent()) {
                        double priceDiscount = 0;
                        item.setOriginPrice(item.getPrice());
                        if (productDiscountMapper.get().getDiscountType().equals(TypeDiscountEnum.DISCOUNT_PERCENT)) {
                            priceDiscount = item.getPrice() * ((double) productDiscountMapper.get().getDiscountPercent() / 100);
                        } else {
                            priceDiscount = item.getPrice() - productDiscountMapper.get().getDiscountMoney();
                        }
                        if (priceDiscount < productDiscountMapper.get().getMinValue()) {
                            item.setPrice(Double.valueOf(productDiscountMapper.get().getMinValue()));
                        } else if (priceDiscount > productDiscountMapper.get().getMaxValue()) {
                            item.setPrice(Double.valueOf(productDiscountMapper.get().getMaxValue()));
                        } else {
                            item.setPrice(priceDiscount);
                        }
                    }
                }).toList();
                model.setOrderDetailModels(orderDetailModels);
            }
            OrderEntity orderEntity = new OrderEntity();
            /// Get total value of order
            sumPriceOrder = model.getOrderDetailModels().stream().mapToDouble(order -> order.getPrice() * order.getQuantity()).sum();
            orderEntity.setRealPrice((int) sumPriceOrder);
            /// Validate coupon code
            if (StringUtils.hasText(model.getCouponCode())) {
                CouponEntity couponEntity = couponRepository.findByCode(model.getCouponCode()).orElse(null);
                if (couponEntity == null) {
                    response.errorResponse("Coupon code is invalid");
                    return response;
                }
                if (couponEntity.getDateStart().before(Date.valueOf(LocalDate.now()))) {
                    response.errorResponse("Coupon code is not still open to use");
                    return response;
                }
                if (couponEntity.getDateEnd().after(Date.valueOf(LocalDate.now()))) {
                    response.errorResponse("Coupon code is expire date to use");
                    return response;
                }
                if (couponEntity.getQuantity() <= 0) {
                    response.errorResponse("Coupon is already used");
                    return response;
                }
                if (!(sumPriceOrder >= couponEntity.getMinValue() && sumPriceOrder <= couponEntity.getMaxValue())) {
                    response.errorResponse("Value of order not satisfy the condition to use coupon");
                    return response;
                }
                if (couponEntity.getType().equals(CouponTypeEnum.COUPON_PERCENT)) {
                    sumPriceOrder -= (sumPriceOrder * ((double) couponEntity.getCouponAmount() / 100));
                }
                else {
                    sumPriceOrder -= couponEntity.getCouponAmount();
                }
                orderEntity.setCouponId(couponEntity.getId());
            }
            UserEntity userCreate = new UserEntity();
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                userCreate = userRepository.findUserEntitiesByUserName(username).orElse(null);
                if (userCreate == null) {
                    response.errorResponse("User token is invalid");
                    return response;
                }
                orderEntity.setCreatedBy(userCreate.getId());
                orderEntity.setUpdatedBy(userCreate.getId());
            } catch (Exception e) {
                log.error(e.getMessage());
                response.errorResponse(e.getMessage());
                return response;
            }
            orderEntity.setFeeDelivery(deliveryEntity.getFee());
            orderEntity.setPayment(paymentEntity);
            orderEntity.setAddress(address);
            orderEntity.setEmployee(employee);
            orderEntity.setUser(userEntity);
            orderEntity.setDeliveryType(deliveryEntity);
            orderEntity.setCreatedDate(Date.valueOf(LocalDate.now()));
            orderEntity.setUpdatedDate(Date.valueOf(LocalDate.now()));
            orderEntity.setTotalPrice(sumPriceOrder);
            orderEntity.setType(model.getType());
            orderEntity.setStage(model.getStage());
            orderEntity.setStatus(model.getStatus());
            orderEntity.setOrderDate(Date.valueOf(LocalDate.now()));
            OrderEntity savedOrder = orderRepository.save(orderEntity);
            if (Optional.ofNullable(savedOrder.getId()).orElse(0) != 0) {
                int bulkInsert = orderDetailService.bulkInsertOrderDetail(model.getOrderDetailModels(), savedOrder, userCreate);
                if (bulkInsert > 0) {
                    response.successResponse(savedOrder.getId(), "Create order success");
                    model.setId(savedOrder.getId());
                    return response;
                }
            }
            response.errorResponse("Create order failed");
            return response;
        } catch (Exception e) {
            log.error(e.getMessage());
            response.errorResponse(e.getMessage());
            return response;
        } finally {
            /// Update quantity coupon after used
            Executors.newSingleThreadExecutor().submit(() -> {
                try {
                    couponRepository.updateQuantity(model.getId());
                } catch (Exception e) {
                    log.error(e.getMessage());
                }
            });
        }
    }

    @Override
    public BaseListResponseModel<List<OrderGetListMapper>> getListOrders(Integer userId, Integer paymentId, Integer employeeId, Integer status, Integer stage, Integer type, Integer startPrice, Integer endPrice, Date startDate, Date endDate, Pageable pageable) {
        BaseListResponseModel<List<OrderGetListMapper>> response = new BaseListResponseModel<>();
        try{
            List<OrderGetListMapper> orderGetListMappers = orderRepository.getListOrder(userId, paymentId, employeeId, status, stage, type, startPrice, endPrice, startDate, endDate, pageable);
            if(orderGetListMappers.isEmpty()){
                response.successResponse(null, "List is empty");
            }
            response.successResponse(orderGetListMappers, "Success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
