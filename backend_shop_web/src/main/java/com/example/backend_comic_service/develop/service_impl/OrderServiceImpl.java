package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.constants.CouponTypeEnum;
import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.constants.ProductDiscountStatusEnum;
import com.example.backend_comic_service.develop.constants.TypeDiscountEnum;
import com.example.backend_comic_service.develop.entity.*;
import com.example.backend_comic_service.develop.enums.YesNoEnum;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.OrderGetListMapper;
import com.example.backend_comic_service.develop.model.mapper.ProductDiscountMapper;
import com.example.backend_comic_service.develop.model.model.AddressModel;
import com.example.backend_comic_service.develop.model.model.OrderDetailModel;
import com.example.backend_comic_service.develop.model.model.OrderModel;
import com.example.backend_comic_service.develop.repository.*;
import com.example.backend_comic_service.develop.service.IAddressService;
import com.example.backend_comic_service.develop.service.IOrderDetailService;
import com.example.backend_comic_service.develop.service.IOrderService;
import com.example.backend_comic_service.develop.utils.AuthenticationService;
import com.example.backend_comic_service.develop.utils.HashService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.OrderValidator;
import jakarta.transaction.Transactional;
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
import java.util.concurrent.Executors;
import java.util.stream.Collectors;


@Transactional
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
    @Autowired
    private UtilService utilService;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private HashService hashService;
    @Autowired
    private IAddressService addressService;
    @Autowired
    private OrderCouponMappingRepository orderCouponMappingRepository;
    @Autowired
    private LogPaymentHistoryRepository logPaymentHistoryRepository;
    @Autowired
    private LogActionOrderRepository logActionOrderRepository;
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private ProductRepository productRepository;
    @Override
    public BaseResponseModel<Integer> createOrder(OrderModel model) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            String errorMsg = orderValidator.validate(model);
            if (StringUtils.hasText(errorMsg)) {
                response.errorResponse(errorMsg);
                return response;
            }
            AddressEntity addressEntity = new AddressEntity();
            UserEntity userEntity = new UserEntity();
            ///  Handle when customer order is customer visit
            if(model.getUserType() == 1){
                RoleEntity roleEntity = roleRepository.findRoleEntitiesById(Long.valueOf(model.getUserModel().getRoleId())).orElse(null);
                if (roleEntity == null) {
                    response.errorResponse("Role id not exist");
                    return response;
                }
                UserEntity entity = model.getUserModel().toUserEntity();

                Integer idLastest = userRepository.generateUserCode();
                idLastest = idLastest == null ? 1 : (idLastest + 1);
                String codeGender = utilService.getGenderCode("CUSVISIT", idLastest);
                entity.setCode(codeGender);
                try {
                    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                    String username = authentication.getName();
                    UserEntity userCreate = userRepository.findUserEntitiesByUserName(username).orElse(null);
                    if (userCreate == null) {
                        response.errorResponse("User token is invalid");
                        return response;
                    }
                    entity.setCreatedBy(userCreate.getId());
                    entity.setCreatedDate(LocalDateTime.now());
                    entity.setUpdatedBy(userCreate.getId());
                    entity.setUpdatedDate(LocalDateTime.now());
                    entity.setUserName(model.getUserModel().getPhoneNumber());
                } catch (Exception e) {
                    log.error(e.getMessage());
                    response.errorResponse(e.getMessage());
                    return response;
                }
                String passwordHash = hashService.md5Hash(model.getUserModel().getPhoneNumber());
                entity.setPassword(passwordHash);
                entity.setRoleEntity(roleEntity);
                UserEntity userSave = userRepository.saveAndFlush(entity);
                if (userSave.getId() != null) {
                    addressService.bulkInsertAddress(model.getUserModel().getAddress().stream().filter(item -> item.getStage() == 1).toList(), userSave, entity);
                    userEntity = userSave;
                    addressEntity = addressRepository.getTop1ByUserId(userSave.getId()).orElse(null);
                }
            }else{
                userEntity = userRepository.findUserEntitiesById(model.getUserId()).orElse(null);
                if (userEntity == null) {
                    response.errorResponse("User is invalid");
                    return response;
                }
            }

            PaymentEntity paymentEntity = paymentRepository.findById(model.getPaymentId()).orElse(null);
            if (paymentEntity == null) {
                response.errorResponse("Payment is invalid");
                return response;
            }
            if(model.getUserType() == 2){
                addressEntity = addressRepository.findById(model.getAddressId()).orElse(null);
                if (addressEntity == null) {
                    response.errorResponse("Address is invalid");
                    return response;
                }
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
            ///  Handle when products have exists in discount programs
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
                         item.setPrice(priceDiscount);
                    }
                }).toList();
                model.setOrderDetailModels(orderDetailModels);
            }
            OrderEntity orderEntity = new OrderEntity();
            /// Get total value of order
            sumPriceOrder = model.getOrderDetailModels().stream().mapToDouble(order -> order.getPrice() * order.getQuantity()).sum();
            orderEntity.setRealPrice((int) sumPriceOrder);
            CouponEntity couponEntity = null;
            ///  Handle when use coupon code
            if (StringUtils.hasText(model.getCouponCode())) {
                couponEntity = couponRepository.findByCode(model.getCouponCode()).orElse(null);
                if (couponEntity == null) {
                    response.errorResponse("Coupon code is invalid");
                    return response;
                }
                if (couponEntity.getDateStart().isAfter(LocalDateTime.now())) {
                    response.errorResponse("Coupon code is not still open to use");
                    return response;
                }
                if (couponEntity.getDateEnd().isBefore(LocalDateTime.now())) {
                    response.errorResponse("Coupon code is expire date to use");
                    return response;
                }
                if (couponEntity.getQuantityUsed() > couponEntity.getQuantity()) {
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
            orderEntity.setCode(generateCode(null));
            orderEntity.setFeeDelivery(deliveryEntity.getFee());
            orderEntity.setPayment(paymentEntity);
            orderEntity.setAddress(addressEntity);
            orderEntity.setEmployee(userCreate);
            orderEntity.setUser(userEntity);
            orderEntity.setDeliveryType(deliveryEntity);
            orderEntity.setCreatedDate(LocalDateTime.now());
            orderEntity.setUpdatedDate(LocalDateTime.now());
            orderEntity.setTotalPrice(sumPriceOrder);
            orderEntity.setType(model.getType());
            orderEntity.setStage(model.getStage());
            if (model.getType() == 2) {
                orderEntity.setStatus(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue());
            } else {
                if (YesNoEnum.NO.equals(model.getIsDeliver())) {
                    orderEntity.setStatus(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue());
                } else {
                    orderEntity.setStatus(OrderStatusEnum.ORDER_STATUS_WAITING_ACCEPT.getValue());
                }
            }

            orderEntity.setOrderDate(LocalDate.now());
            OrderEntity savedOrder = orderRepository.save(orderEntity);
            if (Optional.ofNullable(savedOrder.getId()).orElse(0) != 0) {
                int bulkInsert = orderDetailService.bulkInsertOrderDetail(model.getOrderDetailModels(), savedOrder, userCreate);
                if (bulkInsert > 0) {
                    /// Insert to coupon order mapping table if it used coupon code
                    if(couponEntity != null && model.getId() == null){
                        OrderCouponMappingEntity orderCouponMapping = new OrderCouponMappingEntity();
                        orderCouponMapping.setOrderEntity(savedOrder);
                        orderCouponMapping.setCouponEntity(couponEntity);
                        OrderCouponMappingEntity orderCouponMappingEntity = orderCouponMappingRepository.saveAndFlush(orderCouponMapping);
                        if(orderCouponMappingEntity.getId() == null){
                            response.errorResponse("Something went wrong");
                            return response;
                        }
                    }
                    ///  Update log event
                    if(model.getDeliveryType() != null  && model.getId() == null){
                        LogActionOrderEntity logActionOrderEntity = new LogActionOrderEntity();
                        logActionOrderEntity.setUser(userCreate);
                        logActionOrderEntity.setOrder(savedOrder);
                        if (model.getType() == 2) {
                            logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue());
                        } else {
                            if (YesNoEnum.NO.equals(model.getIsDeliver())) {
                                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue());
                            } else {
                                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_WAITING_ACCEPT.getValue());
                            }
                        }
                        logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                        logActionOrderEntity.setName("");
                        LogActionOrderEntity logActionOrder = logActionOrderRepository.saveAndFlush(logActionOrderEntity);
                        if(logActionOrder.getId() == null){
                            response.errorResponse("Something went wrong");
                            return response;
                        }
                    }
                    /// Insert to payment log
                    if(model.getId() == null){
                        LogPaymentHistoryEntity logPaymentHistoryEntity = new LogPaymentHistoryEntity();
                        logPaymentHistoryEntity.setUser(userCreate);
                        logPaymentHistoryEntity.setOrder(savedOrder);
                        logPaymentHistoryEntity.setStatus(1);
                        logPaymentHistoryEntity.setDescription("");
                        logPaymentHistoryEntity.setCreatedDate(LocalDateTime.now());
                        logPaymentHistoryEntity.setAmount(savedOrder.getTotalPrice());
                        LogPaymentHistoryEntity logPaymentHistory = logPaymentHistoryRepository.saveAndFlush(logPaymentHistoryEntity);
                        if(logPaymentHistory.getId() == null){
                            response.errorResponse("Something went wrong");
                            return response;
                        }
                    }
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
            if(model.getStatus().equals(OrderStatusEnum.ORDER_STATUS_ACCEPT) || model.getStatus().equals(OrderStatusEnum.ORDER_STATUS_ACCEPT)){
                Executors.newSingleThreadExecutor().submit(() -> {
                    try {
                        couponRepository.updateQuantity(model.getId());
                        productRepository.updateStock(model.getId());
                    } catch (Exception e) {
                        log.error(e.getMessage());
                    }
                });
            }
        }
    }

    @Override
    public BaseListResponseModel<List<OrderGetListMapper>> getListOrders(Integer userId, Integer paymentId, Integer employeeId, Integer status, Integer stage, Integer type, Integer startPrice, Integer endPrice, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        BaseListResponseModel<List<OrderGetListMapper>> response = new BaseListResponseModel<>();
        try{
            Page<OrderGetListMapper> orderGetListMappers = orderRepository.getListOrder(userId, paymentId, employeeId, status, stage, type, startPrice, endPrice, startDate, endDate, pageable);
            if(orderGetListMappers.getContent().isEmpty()){
                response.successResponse(null, "List is empty");
            }
            response.setTotalCount((int) orderGetListMappers.getTotalElements());
            response.setPageIndex(pageable.getPageNumber());
            response.setPageSize(pageable.getPageSize());
            response.successResponse(orderGetListMappers.getContent(), "Success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<String> generateCode() {
        BaseResponseModel<String> response  = new BaseResponseModel<>();
        try{
            Integer idLastest =  orderRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("ODR", idLastest);
            response.successResponse(codeGender, "Generate product code success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> updateStatus(Integer id, OrderStatusEnum status, String description) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            OrderEntity orderEntity = orderRepository.findById(id).orElse(null);
            if(orderEntity == null){
                response.errorResponse("Order not exist");
                return response;
            }
            UserEntity userEntity = authenticationService.authenToken();
            if(userEntity == null){
                response.errorResponse("Authentication failed");
                return response;
            }
            List<LogActionOrderEntity> logActionOrderEntities = new ArrayList<>();
            LogActionOrderEntity logActionOrderEntity = new LogActionOrderEntity();
            List<LogActionOrderEntity> logActionOrder = new ArrayList<>();
            if(status.equals(OrderStatusEnum.ORDER_STATUS_DELIVERY)){
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription("Tiếp nhận đơn hàng");
                logActionOrderEntities.add(logActionOrderEntity);

                logActionOrderEntity = new LogActionOrderEntity();
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_DELIVERY.getValue());
                orderEntity.setStatus(OrderStatusEnum.ORDER_STATUS_DELIVERY.getValue());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription("Chuyển cho đơn vị vận chuyển");
                logActionOrderEntities.add(logActionOrderEntity);

                logActionOrder = logActionOrderRepository.saveAllAndFlush(logActionOrderEntities);
                if(logActionOrder.isEmpty()){
                    response.errorResponse("Something went wrong");
                    return response;
                }
                orderRepository.save(orderEntity);
                Executors.newSingleThreadExecutor().submit(() -> {
                    try {
                        couponRepository.updateQuantity(id);
                    } catch (Exception e) {
                        log.error(e.getMessage());
                    }
                });
                response.successResponse(id, "Update status successful");
                return response;
            }

            if (status.equals(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY)) {
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY.getValue());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY.getDescription());
                logActionOrderEntities.add(logActionOrderEntity);

                logActionOrderEntity = new LogActionOrderEntity();
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY.getValue());
                orderEntity.setStatus(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY.getValue());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription("Đơn vị vận chuyển đang vận chuyển");
                logActionOrderEntities.add(logActionOrderEntity);

                logActionOrder = logActionOrderRepository.saveAllAndFlush(logActionOrderEntities);
                if (logActionOrder.isEmpty()) {
                    response.errorResponse("Something went wrong");
                    return response;
                }
                orderRepository.save(orderEntity);
                Executors.newSingleThreadExecutor().submit(() -> {
                    try {
                        couponRepository.updateQuantity(id);
                    } catch (Exception e) {
                        log.error(e.getMessage());
                    }
                });
                response.successResponse(id, "Update status successful");
                return response;
            }

            if(status.equals(OrderStatusEnum.ORDER_STATUS_SUCCESS)){
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY.getValue());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription("Giao hàng thành công");
                logActionOrderEntities.add(logActionOrderEntity);

                logActionOrderEntity = new LogActionOrderEntity();
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_SUCCESS.getValue());
                orderEntity.setStatus(OrderStatusEnum.ORDER_STATUS_SUCCESS.getValue());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription("Hoàn thành đơn hàng");
                logActionOrderEntities.add(logActionOrderEntity);
                logActionOrder = logActionOrderRepository.saveAllAndFlush(logActionOrderEntities);
                if(logActionOrder.isEmpty()){
                    response.errorResponse("Something went wrong");
                    return response;
                }
                orderRepository.save(orderEntity);
                response.successResponse(id, "Update status successful");
                return response;
            }

            if(status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) || status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE)){
                logActionOrderEntity = new LogActionOrderEntity();
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setStatusId(status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) ?OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL.getValue() : OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE.getValue());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription(description);
                orderEntity.setStatus(status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) ?OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL.getValue() : OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE.getValue());
                LogActionOrderEntity logActionOrderEntity1 = logActionOrderRepository.saveAndFlush(logActionOrderEntity);
                if(logActionOrderEntity1.getId() == null){
                    response.errorResponse("Something went wrong");
                    return response;
                }
                orderRepository.updateOrderStatus(status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) ?OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL : OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE, id);
                response.successResponse(id, "Update status successful");
                return response;
            }

            response.successResponse(id, "Update status successful");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    public String generateCode(Integer mark){
        try{
            Integer idLastest =  orderRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("ODR", idLastest);
            return codeGender;
        }
        catch (Exception e){
            return null;
        }
    }
}
