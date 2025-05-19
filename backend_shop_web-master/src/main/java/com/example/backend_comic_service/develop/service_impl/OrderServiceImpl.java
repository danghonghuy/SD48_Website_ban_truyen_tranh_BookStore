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
import org.apache.commons.lang3.tuple.Pair;
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
public class OrderServiceImpl extends GenerateService implements IOrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
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
        OrderStatusEnum statusEnum = null;
        try {
            String errorMsg = orderValidator.validate(model);
            if (StringUtils.hasText(errorMsg)) {
                response.errorResponse(errorMsg);
                return response;
            }
            AddressEntity addressEntity = null;
            UserEntity userCustomer = model.getUserModel().toUserEntity();
            OrderEntity orderEntity = new OrderEntity();
            if (model.getId() != null)
                orderEntity = orderRepository.findById(model.getId()).orElse(new OrderEntity());

            ///  Handle when customer order is customer visit
            if (model.getUserType() == 1) {
                RoleEntity roleEntity = roleRepository.findRoleEntitiesById(Long.valueOf(model.getUserModel().getRoleId())).orElse(null);
                if (roleEntity == null) {
                    response.errorResponse("Mã vai trò không tồn tại");
                    return response;
                }
                UserEntity userCreate = null;
//                userCustomer = userRepository.findUserEntitiesByUserNameAndStatus(model.getUserModel().getPhoneNumber(), 1).orElse(null);
                Integer idLastest = userRepository.generateUserCode();
                idLastest = idLastest == null ? 1 : (idLastest + 1);
                try {
                    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                    String username = authentication.getName();
                    userCreate = userRepository.findUserEntitiesByUserNameAndStatus(username, 1).orElse(null);

                    if (userCreate == null) {
                        response.errorResponse("Token người dùng không hợp lệ");
                        return response;
                    }
//                    if (userCustomer == null) {
                        userCustomer = model.getUserModel().toUserEntity();
                        userCustomer.setCode(utilService.getGenderCode("CUSVISIT", idLastest));
                        userCustomer.setCreatedBy(userCreate.getId());
                        userCustomer.setCreatedDate(LocalDateTime.now());
                        userCustomer.setUpdatedBy(userCreate.getId());
                        userCustomer.setUpdatedDate(LocalDateTime.now());
                        userCustomer.setUserName(model.getUserModel().getPhoneNumber());
                        String passwordHash = hashService.md5Hash(model.getUserModel().getPhoneNumber());
                        userCustomer.setPassword(passwordHash);
                        userCustomer.setRoleEntity(roleEntity);
                        userCustomer = userRepository.saveAndFlush(userCustomer);
//                    }
                } catch (Exception e) {
                    log.error(e.getMessage());
                    response.errorResponse(e.getMessage());
                    return response;
                }

                if (userCustomer != null) {
                    addressEntity = addressRepository.getAddressEntity(userCustomer.getId());
                    if (addressEntity == null) {
                        addressService.bulkInsertAddress(model.getUserModel().getAddress().stream().filter(item -> item.getStage() == 1).toList(),
                                userCustomer, userCreate, model.getIsChangeOrder(), orderEntity);
                    }
                    addressEntity = addressRepository.getTop1ByUserId(userCustomer.getId()).orElse(null);
                }
            } else {
                userCustomer = userRepository.findUserEntitiesById(model.getUserId()).orElse(null);
                if (userCustomer == null) {
                    response.errorResponse("Người dùng không hợp lệ");
                    return response;
                }
            }
            if (YesNoEnum.YES.equals(model.getIsDeliver())) { // Giả sử model.getIsDeliver() trả về YesNoEnum
                // hoặc bạn có một trường tương tự để biết có giao hàng không
                if (model.getAddressId() != null) {
                    addressEntity = addressRepository.findById(model.getAddressId()).orElse(null);
                }
                if (addressEntity == null) {
                    response.errorResponse("Địa chỉ giao hàng không hợp lệ cho người dùng đã đăng ký");
                    return response;
                }
            } else {
                // Nếu không giao hàng (lấy tại quầy), addressEntity có thể là null
                addressEntity = null;
            }

            PaymentEntity paymentEntity = paymentRepository.findById(model.getPaymentId()).orElse(null);
            if (paymentEntity == null) {
                response.errorResponse("Phương thức thanh toán không hợp lệ");
                return response;
            }

            Pair<OrderStatusEnum, Integer> enumIntegerPair = this.getStatusOrder(model, paymentEntity);

            DeliveryEntity deliveryEntity = deliveryRepository.findById(enumIntegerPair.getRight()).orElse(null);
            if (deliveryEntity == null) {
                response.errorResponse("Loại giao hàng không hợp lệ");
                return response;
            }
            double sumPriceOrder = 0;
            if (model.getOrderDetailModels().isEmpty() && model.getIsChangeOrder() == 0) {
                response.errorResponse("Đơn hàng không có sản phẩm");
                return response;
            }

            /// Get total value of order
            sumPriceOrder = model.getOrderDetailModels().stream().mapToDouble(order -> order.getPrice() * order.getQuantity()).sum();
            orderEntity.setRealPrice((int) sumPriceOrder);
            CouponEntity couponEntity = null;
            ///  Handle when use coupon code
            if (StringUtils.hasText(model.getCouponCode())) {
                couponEntity = couponRepository.findByCode(model.getCouponCode()).orElse(null);
                if (couponEntity == null) {
                    response.errorResponse("Phiếu giảm giá không hợp lệ");
                    return response;
                }
                if (couponEntity.getDateStart().isAfter(LocalDateTime.now())) {
                    response.errorResponse("Phiếu giảm giá chưa đến ngày sử dụng");
                    return response;
                }
                if (couponEntity.getDateEnd().isBefore(LocalDateTime.now())) {
                    response.errorResponse("Phiếu giảm giá đã hết hạn");
                    return response;
                }
                if (couponEntity.getQuantityUsed() > couponEntity.getQuantity()) {
                    response.errorResponse("Phiếu giảm giá đã được sử dụng");
                    return response;
                }
                if (sumPriceOrder < couponEntity.getMinValue()) {
                    response.errorResponse("Giá trị đơn hàng không thỏa mãn điều kiện để sử dụng phiếu giảm giá");
                    return response;
                }
                if (couponEntity.getType().equals(CouponTypeEnum.COUPON_PERCENT)) {
                    Double orderAddCoupon = sumPriceOrder * couponEntity.getPercentValue() / 100;
                    if (orderAddCoupon > couponEntity.getMaxValue()) {
                        orderAddCoupon = Double.valueOf(couponEntity.getMaxValue());
                    }
                    sumPriceOrder -= orderAddCoupon;
                } else {
                    sumPriceOrder -= couponEntity.getCouponAmount();
                }
                orderEntity.setCouponId(couponEntity.getId());
            }
            UserEntity userCreate = new UserEntity();
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                userCreate = userRepository.findUserEntitiesByUserNameAndStatus(username, 1).orElse(null);
                if (userCreate == null) {
                    response.errorResponse("Token người dùng không hợp lệ");
                    return response;
                }
                orderEntity.setCreatedBy(userCreate.getId());
                orderEntity.setUpdatedBy(userCreate.getId());
            } catch (Exception e) {
                log.error(e.getMessage());
                response.errorResponse(e.getMessage());
                return response;
            }
            orderEntity.setCode(orderEntity.getCode() == null ? generateCode(null) : orderEntity.getCode());
            orderEntity.setFeeDelivery(model.getFeeDelivery());
            orderEntity.setPayment(paymentEntity);
            orderEntity.setAddress(addressEntity);
            orderEntity.setEmployee(userCreate);
            orderEntity.setUser(userCustomer);
            orderEntity.setDeliveryType(deliveryEntity);
            orderEntity.setCreatedDate(LocalDateTime.now());
            orderEntity.setUpdatedDate(LocalDateTime.now());
            orderEntity.setTotalPrice(sumPriceOrder);
            orderEntity.setType(model.getType());
            orderEntity.setStage(model.getStage());
            statusEnum = model.getId() == null ? enumIntegerPair.getLeft() : OrderStatusEnum.fromValue(orderEntity.getStatus());
            orderEntity.setStatus(statusEnum.getValue());

            orderEntity.setOrderDate(LocalDate.now());
            OrderEntity savedOrder = orderRepository.save(orderEntity);
            if (Optional.ofNullable(savedOrder.getId()).orElse(0) != 0) {
                int bulkInsert = orderDetailService.bulkInsertOrderDetail(model.getOrderDetailModels(), savedOrder, userCreate, model.getIsChangeOrder());
                if (bulkInsert > 0) {
                    /// Insert to coupon order mapping table if it used coupon code
                    if (couponEntity != null && model.getId() == null) {
                        OrderCouponMappingEntity orderCouponMapping = new OrderCouponMappingEntity();
                        orderCouponMapping.setOrderEntity(savedOrder);
                        orderCouponMapping.setCouponEntity(couponEntity);
                        OrderCouponMappingEntity orderCouponMappingEntity = orderCouponMappingRepository.saveAndFlush(orderCouponMapping);
                        if (orderCouponMappingEntity.getId() == null) {
                            response.errorResponse("Đã xảy ra lỗi");
                            return response;
                        }
                    }
                    ///  Update log event
                    if (model.getDeliveryType() != null && model.getId() == null) {
                        LogActionOrderEntity logActionOrderEntity = new LogActionOrderEntity();
                        logActionOrderEntity.setUser(userCreate);
                        logActionOrderEntity.setOrder(savedOrder);
                        logActionOrderEntity.setStatusId(statusEnum.getValue());
                        logActionOrderEntity.setDescription(statusEnum.getDescription());
                        logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                        logActionOrderEntity.setName(getUserEntity().getUsername());
                        LogActionOrderEntity logActionOrder = logActionOrderRepository.saveAndFlush(logActionOrderEntity);
                        if (logActionOrder.getId() == null) {
                            response.errorResponse("Đã xảy ra lỗi");
                            return response;
                        }
                    }
                    LogPaymentHistoryEntity logPaymentHistoryEntity = null;
                    /// Insert to payment log
                    if (model.getId() == null) {
                        logPaymentHistoryEntity = new LogPaymentHistoryEntity();
                    } else {
                        logPaymentHistoryEntity = logPaymentHistoryRepository.findByOrderId(model.getId());
                    }
                    logPaymentHistoryEntity.setAmount(savedOrder.getTotalPrice());
                    logPaymentHistoryEntity.setUser(userCreate);
                    logPaymentHistoryEntity.setOrder(savedOrder);
                    int statusRs = 1;
                    if (model.getType() == 2) { // online
                        statusRs = "PAY000003".equals(paymentEntity.getCode()) ? 0 : 1;
                    }
                    logPaymentHistoryEntity.setStatus(statusRs);
                    logPaymentHistoryEntity.setDescription("");
                    logPaymentHistoryEntity.setCreatedDate(LocalDateTime.now());
                    LogPaymentHistoryEntity logPaymentHistory = logPaymentHistoryRepository.saveAndFlush(logPaymentHistoryEntity);
                    if (logPaymentHistory.getId() == null) {
                        response.errorResponse("Something went wrong");
                        return response;
                    }
                    response.successResponse(savedOrder.getId(), "Tạo đơn hàng thành công");
                    model.setId(savedOrder.getId());
                    return response;
                } else if (bulkInsert == -2) {
                    response.errorResponse("Số lượng sản phẩm không đủ");
                }
            }
            response.errorResponse("Tạo đơn hàng thất bại");
            return response;
        } catch (Exception e) {
            log.error(e.getMessage());
            response.errorResponse(e.getMessage());
            return response;
        } finally {
            /// Update quantity coupon after used
            if (OrderStatusEnum.ORDER_STATUS_ACCEPT.equals(statusEnum)
                    || OrderStatusEnum.ORDER_STATUS_SUCCESS.equals(statusEnum)) {
                Executors.newSingleThreadExecutor().submit(() -> {
                    try {
                        couponRepository.updateQuantity(model.getId());
                        productRepository.updateMinusStock(model.getId());
                        orderDetailRepository.updateUseQuantity(model.getId());
                    } catch (Exception e) {
                        log.error(e.getMessage());
                    }
                });
            }
        }
    }

    private Pair<OrderStatusEnum, Integer> getStatusOrder(OrderModel model, PaymentEntity paymentEntity) {
        OrderStatusEnum statusEnum = null;
        Integer deliveryType = 2;
        if (model.getType() == 2) { // online
            log.info("payment-type {} - {}", paymentEntity.getId(), paymentEntity.getCode());
            if ("PAY000003".equals(paymentEntity.getCode())) { // ship cod
                statusEnum = OrderStatusEnum.ORDER_STATUS_WAITING_ACCEPT;
            } else if ("PAY000002".equals(paymentEntity.getCode())) { // banking
                statusEnum = OrderStatusEnum.ORDER_STATUS_ACCEPT;
            } else if("PAY000004".equals(paymentEntity.getCode())) { // momo
                statusEnum = OrderStatusEnum.ORDER_STATUS_ACCEPT;
            }
        } else { // counter
            if (YesNoEnum.NO.equals(model.getIsDeliver())) { // no ship
                statusEnum = OrderStatusEnum.ORDER_STATUS_SUCCESS;
                deliveryType = 1;
            } else { // ship
                statusEnum = OrderStatusEnum.ORDER_STATUS_ACCEPT;
            }
        }
        return Pair.of(statusEnum, deliveryType);
    }

    @Override
    public BaseListResponseModel<List<OrderGetListMapper>> getListOrders(Integer userId, Integer paymentId, Integer employeeId, Integer status, Integer stage, Integer type, Integer startPrice, Integer endPrice, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        BaseListResponseModel<List<OrderGetListMapper>> response = new BaseListResponseModel<>();
        try {
            Page<OrderGetListMapper> orderGetListMappers = orderRepository.getListOrder(userId, paymentId, employeeId, status, stage, type, startPrice, endPrice, startDate, endDate, pageable);
            if (orderGetListMappers.getContent().isEmpty()) {
                response.successResponse(null, "Danh sách trống");
            }
            response.setTotalCount((int) orderGetListMappers.getTotalElements());
            response.setPageIndex(pageable.getPageNumber());
            response.setPageSize(pageable.getPageSize());
            response.successResponse(orderGetListMappers.getContent(), "Thành công");
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
            Integer idLastest = orderRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("ODR", idLastest);
            response.successResponse(codeGender, "Tạo mã sản phẩm thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> updateStatus(Integer id, OrderStatusEnum status, String note) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            OrderEntity orderEntity = orderRepository.findById(id).orElse(null);
            if (orderEntity == null) {
                response.errorResponse("Đơn hàng không tồn tại");
                return response;
            }
            orderEntity.setUpdatedDate(LocalDateTime.now());
            UserEntity userEntity = authenticationService.authenToken();
            if (userEntity == null) {
                response.errorResponse("Xác thực người dùng thất bại");
                return response;
            }
            List<LogActionOrderEntity> logActionOrderEntities = new ArrayList<>();
            LogActionOrderEntity logActionOrderEntity = new LogActionOrderEntity();
            List<LogActionOrderEntity> logActionOrder = new ArrayList<>();
            LogPaymentHistoryEntity logPaymentHistory = orderEntity.getPaymentHistoryEntities().get(0);

            if (status.equals(OrderStatusEnum.ORDER_STATUS_DELIVERY)) {

                logActionOrderEntity = new LogActionOrderEntity();
                logActionOrderEntity.setNote(note);
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_DELIVERY.getValue());
                orderEntity.setStatus(OrderStatusEnum.ORDER_STATUS_DELIVERY.getValue());
                orderEntity.setDescription(OrderStatusEnum.ORDER_STATUS_DELIVERY.getDescription());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription("Chuyển cho đơn vị vận chuyển");
                logActionOrderEntity.setName(getUserEntity().getUsername());
                logActionOrderEntities.add(logActionOrderEntity);

                logActionOrder = logActionOrderRepository.saveAllAndFlush(logActionOrderEntities);
                if (logActionOrder.isEmpty()) {
                    response.errorResponse("Đã xảy ra lỗi");
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
                response.successResponse(id, "Cập nhật trạng thái thành công");
                return response;
            } else if (status.equals(OrderStatusEnum.ORDER_STATUS_ACCEPT)) {

                logActionOrderEntity = new LogActionOrderEntity();
                logActionOrderEntity.setNote(note);
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue());
                orderEntity.setStatus(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue());
                orderEntity.setDescription(OrderStatusEnum.ORDER_STATUS_ACCEPT.getDescription());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription(OrderStatusEnum.ORDER_STATUS_ACCEPT.getDescription());
                logActionOrderEntity.setName(getUserEntity().getUsername());
                logActionOrderEntities.add(logActionOrderEntity);

                logActionOrder = logActionOrderRepository.saveAllAndFlush(logActionOrderEntities);
                if (logActionOrder.isEmpty()) {
                    response.errorResponse("Đã xảy ra lỗi");
                    return response;
                }
                orderRepository.save(orderEntity);
                Executors.newSingleThreadExecutor().submit(() -> {
                    try {
                        couponRepository.updateQuantity(id);
                        productRepository.updateMinusStock(id);
                        orderDetailRepository.updateUseQuantity(id);
                    } catch (Exception e) {
                        log.error(e.getMessage());
                    }
                });
                response.successResponse(id, "Cập nhật trạng thái thành công");
                return response;
            } else if (status.equals(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY)) {
                logActionOrderEntity = new LogActionOrderEntity();
                logActionOrderEntity.setNote(note);
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY.getValue());
                orderEntity.setStatus(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY.getValue());
                orderEntity.setDescription(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY.getDescription());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY.getDescription());
                logActionOrderEntity.setName(getUserEntity().getUsername());
                logActionOrderEntities.add(logActionOrderEntity);

                logActionOrder = logActionOrderRepository.saveAllAndFlush(logActionOrderEntities);
                if (logActionOrder.isEmpty()) {
                    response.errorResponse("Đã xảy ra lỗi");
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
                response.successResponse(id, "Cập nhật trạng thái thành công");
                return response;
            } else if (status.equals(OrderStatusEnum.ORDER_STATUS_SUCCESS)) {
                logActionOrderEntity = new LogActionOrderEntity();
                logActionOrderEntity.setNote(note);
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setStatusId(OrderStatusEnum.ORDER_STATUS_SUCCESS.getValue());
                logActionOrderEntity.setName(getUserEntity().getUsername());
                orderEntity.setStatus(OrderStatusEnum.ORDER_STATUS_SUCCESS.getValue());
                orderEntity.setDescription(OrderStatusEnum.ORDER_STATUS_SUCCESS.getDescription());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription(OrderStatusEnum.ORDER_STATUS_SUCCESS.getDescription());
                logActionOrderEntities.add(logActionOrderEntity);
                logActionOrder = logActionOrderRepository.saveAllAndFlush(logActionOrderEntities);
                int statusRs = 1;
                if (orderEntity.getType() == 2) { // online
                    statusRs = "PAY000003".equals(orderEntity.getCode()) ? 0 : 1;
                }
                logPaymentHistory.setStatus(statusRs);
                logPaymentHistoryRepository.saveAndFlush(logPaymentHistory);

                if (logActionOrder.isEmpty()) {
                    response.errorResponse("Đã xảy ra lỗi");
                    return response;
                }
                orderRepository.save(orderEntity);
//                if (orderEntity.getType() == 1) {
//                    productRepository.updateMinusStock(orderEntity.getId());
//                    orderDetailRepository.updateUseQuantity(id);
//                }
                response.successResponse(id, "Update status successful");
                return response;
            } else if (status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) || status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE)) {
                logActionOrderEntity = new LogActionOrderEntity();
                logActionOrderEntity.setNote(note);
                logActionOrderEntity.setUser(userEntity);
                logActionOrderEntity.setOrder(orderEntity);
                logActionOrderEntity.setName(getUserEntity().getUsername());
                logActionOrderEntity.setStatusId(status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) ? OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL.getValue() : OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE.getValue());
                logActionOrderEntity.setCreatedDate(LocalDateTime.now());
                logActionOrderEntity.setDescription(status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) ? OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL.getDescription() : OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE.getDescription());
                orderEntity.setStatus(status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) ? OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL.getValue() : OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE.getValue());
                orderEntity.setDescription(status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) ? OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL.getDescription() : OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE.getDescription());
                LogActionOrderEntity logActionOrderEntity1 = logActionOrderRepository.saveAndFlush(logActionOrderEntity);
                if (logActionOrderEntity1.getId() == null) {
                    response.errorResponse("Đã xảy ra lỗi");
                    return response;
                }
                orderRepository.updateOrderStatus(status.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) ? OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL : OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE, id);
                response.successResponse(id, "Cập nhật trạng thái thành công");
                productRepository.updateAddStock(orderEntity.getId());

                return response;
            }

            response.successResponse(id, "Cập nhật trạng thái thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    public String generateCode(Integer mark) {
        try {
            Integer idLastest = orderRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("ODR", idLastest);
            return codeGender;
        } catch (Exception e) {
            return null;
        }
    }
}
