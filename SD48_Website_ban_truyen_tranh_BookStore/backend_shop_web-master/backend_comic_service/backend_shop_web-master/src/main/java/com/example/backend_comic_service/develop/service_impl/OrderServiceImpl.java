package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.*;
import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.enums.YesNoEnum;
import com.example.backend_comic_service.develop.exception.BadRequestException;
import com.example.backend_comic_service.develop.exception.InsufficientStockException;
import com.example.backend_comic_service.develop.exception.ResourceNotFoundException;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.mapper.OrderGetListMapper;
import com.example.backend_comic_service.develop.model.model.OrderModel;
import com.example.backend_comic_service.develop.model.request.order.OrderUpdateRequest;
import com.example.backend_comic_service.develop.repository.*;
import com.example.backend_comic_service.develop.service.IAddressService;
import com.example.backend_comic_service.develop.service.IOrderDetailService;
import com.example.backend_comic_service.develop.service.IOrderService;
import com.example.backend_comic_service.develop.service.IProductService;
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
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.Instant; // Đảm bảo import Instant
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Transactional
@Service
@Slf4j
public class OrderServiceImpl extends GenerateService implements IOrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderDetailRepository orderDetailRepository;
    @Autowired private OrderValidator orderValidator;
    @Autowired private UserRepository userRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private AddressRepository addressRepository;
    @Autowired private DeliveryRepository deliveryRepository;
    @Autowired private IOrderDetailService orderDetailService;
    @Autowired private CouponRepository couponRepository;
    @Autowired private UtilService utilService;
    @Autowired private RoleRepository roleRepository;
    @Autowired private HashService hashService;
    @Autowired private IAddressService addressService;
    @Autowired private OrderCouponMappingRepository orderCouponMappingRepository;
    @Autowired private LogPaymentHistoryRepository logPaymentHistoryRepository;
    @Autowired private LogActionOrderRepository logActionOrderRepository;
    @Autowired private AuthenticationService authenticationService;
    @Autowired private ProductRepository productRepository;
    @Autowired private IProductService productService;

    @Override
    public BaseResponseModel<Integer> createOrder(OrderModel model) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        OrderEntity orderEntity = new OrderEntity();
        UserEntity currentUserLogin = null;
        try {
            String errorMsg = orderValidator.validate(model);
            if (StringUtils.hasText(errorMsg)) {
                response.errorResponse(errorMsg);
                return response;
            }

            currentUserLogin = authenticationService.authenToken();
            if (currentUserLogin == null) throw new BadRequestException("Xác thực người dùng thất bại.");

            if (model.getId() != null) {
                orderEntity = orderRepository.findById(model.getId()).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng để cập nhật với ID: " + model.getId()));
            }

            AddressEntity addressEntity = null;
            UserEntity userCustomer;

            if (model.getUserType() == 1) {
                RoleEntity roleEntity = roleRepository.findRoleEntitiesById(Long.valueOf(model.getUserModel().getRoleId())).orElseThrow(() -> new ResourceNotFoundException("Mã vai trò không tồn tại: " + model.getUserModel().getRoleId()));
                Integer idLastest = userRepository.generateUserCode();
                idLastest = idLastest == null ? 1 : (idLastest + 1);
                userCustomer = model.getUserModel().toUserEntity();
                userCustomer.setCode(utilService.getGenderCode("CUSVISIT", idLastest));
                userCustomer.setCreatedBy(currentUserLogin.getId());
                userCustomer.setCreatedDate(LocalDateTime.now());
                userCustomer.setUpdatedBy(currentUserLogin.getId());
                userCustomer.setUpdatedDate(LocalDateTime.now());
                userCustomer.setUserName(null);
                userCustomer.setPassword(hashService.md5Hash(model.getUserModel().getPhoneNumber()));
                userCustomer.setRoleEntity(roleEntity);
                userCustomer = userRepository.saveAndFlush(userCustomer);
                if (model.getUserModel().getAddress() != null && !model.getUserModel().getAddress().isEmpty()) {
                    addressService.bulkInsertAddress(model.getUserModel().getAddress().stream().filter(item -> item.getStage() == 1).toList(), userCustomer, currentUserLogin, model.getIsChangeOrder(), orderEntity);
                    addressEntity = addressRepository.getTop1ByUserId(userCustomer.getId()).orElse(null);
                }
            } else {
                userCustomer = userRepository.findUserEntitiesById(model.getUserId()).orElseThrow(() -> new ResourceNotFoundException("Người dùng không hợp lệ với ID: " + model.getUserId()));
            }

            if (model.getIsDeliver() != null && model.getIsDeliver().equals(YesNoEnum.YES.getValue())) {
                if (model.getAddressId() != null) {
                    addressEntity = addressRepository.findById(model.getAddressId())
                            .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ giao hàng không hợp lệ với ID: " + model.getAddressId()));
                } else if (addressEntity == null && model.getUserType() != 1) {
                    addressEntity = userCustomer.getAddressEntities().stream()
                            .filter(a -> a.getIsDefault() != null && a.getIsDefault().equals(YesNoEnum.YES.getValue()) && (a.getIsDeleted() == null || a.getIsDeleted() == 0))
                            .findFirst()
                            .orElseThrow(() -> new BadRequestException("Khách hàng chưa có địa chỉ mặc định hoặc cần chọn địa chỉ giao hàng."));
                } else if (addressEntity == null) {
                    throw new BadRequestException("Cần thông tin địa chỉ giao hàng cho khách vãng lai.");
                }
            } else {
                addressEntity = null;
            }

            PaymentEntity paymentEntity = paymentRepository.findById(model.getPaymentId()).orElseThrow(() -> new ResourceNotFoundException("Phương thức thanh toán không hợp lệ với ID: " + model.getPaymentId()));
            Pair<OrderStatusEnum, Integer> statusAndDeliveryType = this.getStatusOrder(model, paymentEntity);
            OrderStatusEnum determinedInitialStatus = statusAndDeliveryType.getLeft();
            Integer deliveryTypeId = statusAndDeliveryType.getRight();
            DeliveryEntity deliveryEntity = deliveryRepository.findById(deliveryTypeId).orElseThrow(() -> new ResourceNotFoundException("Loại giao hàng không hợp lệ với ID: " + deliveryTypeId));

            if ((model.getOrderDetailModels() == null || model.getOrderDetailModels().isEmpty()) && (model.getIsChangeOrder() == null || model.getIsChangeOrder() == 0)) {
                throw new BadRequestException("Đơn hàng không có sản phẩm");
            }

            double calculatedRealPrice = 0;
            if (model.getOrderDetailModels() != null && !model.getOrderDetailModels().isEmpty()){
                for(com.example.backend_comic_service.develop.model.model.OrderDetailModel detailModel : model.getOrderDetailModels()){
                    double effectiveProductPrice = productService.getEffectivePrice(detailModel.getProductId(), LocalDateTime.now());
                    calculatedRealPrice += effectiveProductPrice * detailModel.getQuantity();
                }
            }
            orderEntity.setRealPrice((int) Math.round(calculatedRealPrice));

            double calculatedTotalPrice = calculatedRealPrice;
            CouponEntity couponEntity = null;
            double discountAmountApplied = 0;

            if (StringUtils.hasText(model.getCouponCode())) {
                couponEntity = couponRepository.findByCode(model.getCouponCode()).orElseThrow(() -> new ResourceNotFoundException("Phiếu giảm giá không hợp lệ: " + model.getCouponCode()));

                Instant currentTimeForCoupon = Instant.now(); // SỬA LẠI DÙNG INSTANT

                if (couponEntity.getDateStart() != null && couponEntity.getDateStart().isAfter(currentTimeForCoupon)) throw new BadRequestException("Phiếu giảm giá chưa đến ngày sử dụng");
                if (couponEntity.getDateEnd() != null && couponEntity.getDateEnd().isBefore(currentTimeForCoupon)) throw new BadRequestException("Phiếu giảm giá đã hết hạn");

                if (couponEntity.getQuantityUsed() != null && couponEntity.getQuantity() != null && couponEntity.getQuantityUsed() >= couponEntity.getQuantity()) throw new BadRequestException("Phiếu giảm giá đã hết lượt sử dụng");
                if (calculatedRealPrice < couponEntity.getMinValue()) throw new BadRequestException("Giá trị đơn hàng (" + calculatedRealPrice + ") không thỏa mãn điều kiện tối thiểu (" + couponEntity.getMinValue() + ") để sử dụng phiếu giảm giá.");

                if (couponEntity.getType() != null) {
                    if (couponEntity.getType().equals(com.example.backend_comic_service.develop.enums.CouponTypeEnum.COUPON_PERCENT.getValue())) {
                        discountAmountApplied = calculatedRealPrice * (couponEntity.getPercentValue() / 100.0);
                        if (couponEntity.getMaxValue() != null && discountAmountApplied > couponEntity.getMaxValue()) discountAmountApplied = couponEntity.getMaxValue();
                    } else if (couponEntity.getType().equals(com.example.backend_comic_service.develop.enums.CouponTypeEnum.COUPON_AMOUNT.getValue())) {
                        discountAmountApplied = couponEntity.getCouponAmount();
                    }
                }
                if (discountAmountApplied > 0) {
                    calculatedTotalPrice -= discountAmountApplied;
                    orderEntity.setCouponId(couponEntity.getId());
                }
            }

            double feeDelivery = model.getFeeDelivery() != null ? model.getFeeDelivery().doubleValue() : 0.0;
            calculatedTotalPrice += feeDelivery;
            orderEntity.setTotalPrice(calculatedTotalPrice < 0 ? 0.0 : calculatedTotalPrice);

            if (model.getId() == null) {
                orderEntity.setCreatedBy(currentUserLogin.getId());
                orderEntity.setCreatedDate(LocalDateTime.now());
                orderEntity.setCode(generateCode(null));
            }
            orderEntity.setUpdatedBy(currentUserLogin.getId());
            orderEntity.setUpdatedDate(LocalDateTime.now());
            orderEntity.setFeeDelivery(model.getFeeDelivery());
            orderEntity.setPayment(paymentEntity);
            orderEntity.setAddress(addressEntity);
            orderEntity.setEmployee(currentUserLogin);
            orderEntity.setUser(userCustomer);
            orderEntity.setDeliveryType(deliveryEntity);
            orderEntity.setType(model.getType());
            orderEntity.setStage(model.getStage() != null ? model.getStage() : 1);
            orderEntity.setStatus(determinedInitialStatus.getValue());
            orderEntity.setOrderDate(LocalDate.now());
            orderEntity.setUserType(model.getUserType());

            OrderEntity savedOrder = orderRepository.save(orderEntity);

            int bulkInsertResult = orderDetailService.bulkInsertOrderDetail(model.getOrderDetailModels(), savedOrder, currentUserLogin, model.getIsChangeOrder());

            if (bulkInsertResult > 0 || (model.getOrderDetailModels() == null || model.getOrderDetailModels().isEmpty() && model.getIsChangeOrder() != null && model.getIsChangeOrder() == 1)) {
                if (couponEntity != null && model.getId() == null && discountAmountApplied > 0) {
                    OrderCouponMappingEntity orderCouponMapping = new OrderCouponMappingEntity();
                    orderCouponMapping.setOrderEntity(savedOrder);
                    orderCouponMapping.setCouponEntity(couponEntity);
                    orderCouponMappingRepository.saveAndFlush(orderCouponMapping);
                }
                LogActionOrderEntity logAction = new LogActionOrderEntity(null, savedOrder, currentUserLogin, determinedInitialStatus.getDescription(), null, determinedInitialStatus.getValue(), LocalDateTime.now(), currentUserLogin.getFullName());
                logActionOrderRepository.saveAndFlush(logAction);

                LogPaymentHistoryEntity logPayment;
                if (model.getId() == null) {
                    logPayment = new LogPaymentHistoryEntity();
                    logPayment.setCreatedDate(LocalDateTime.now());
                } else {
                    logPayment = Optional.ofNullable(logPaymentHistoryRepository.findByOrderId(savedOrder.getId()))
                            .orElseGet(() -> {
                                LogPaymentHistoryEntity newLog = new LogPaymentHistoryEntity();
                                newLog.setCreatedDate(LocalDateTime.now());
                                return newLog;
                            });
                }

                logPayment.setAmount(savedOrder.getTotalPrice());
                logPayment.setUser(currentUserLogin);
                logPayment.setOrder(savedOrder);
                int paymentStatus = 0;
                if (((model.getType() == 1 || model.getType() == 2) && !"PAY000003".equals(paymentEntity.getCode())) || determinedInitialStatus == OrderStatusEnum.ORDER_STATUS_SUCCESS) {
                    paymentStatus = 1;
                }
                logPayment.setStatus(paymentStatus);
                logPayment.setDescription(paymentStatus == 1 ? "Đã thanh toán" : "Chờ thanh toán");
                logPaymentHistoryRepository.saveAndFlush(logPayment);

                response.successResponse(savedOrder.getId(), model.getId() == null ? "Tạo đơn hàng thành công" : "Cập nhật đơn hàng thành công");
            } else if (bulkInsertResult == -2) {
                throw new InsufficientStockException("Số lượng sản phẩm không đủ");
            } else {
                throw new RuntimeException("Lỗi khi xử lý chi tiết đơn hàng.");
            }
            return response;
        } catch (ResourceNotFoundException | InsufficientStockException | BadRequestException e) {
            log.warn("Lỗi nghiệp vụ khi tạo/cập nhật đơn hàng: {}", e.getMessage());
            response.errorResponse(e.getMessage());
            return response;
        } catch (Exception e) {
            log.error("Lỗi không xác định khi tạo/cập nhật đơn hàng: {}", e.getMessage(), e);
            response.errorResponse("Lỗi không xác định trong quá trình xử lý đơn hàng.");
            return response;
        }
    }

    private Pair<OrderStatusEnum, Integer> getStatusOrder(OrderModel model, PaymentEntity paymentEntity) {
        OrderStatusEnum statusEnum;
        Integer deliveryTypeId = model.getDeliveryType(); // Lấy deliveryType từ model nếu có

        // 1. Xử lý Đơn hàng tại quầy (POS) - Type 1
        if (model.getType() == 1) {
            // Kiểm tra xem khách có yêu cầu giao hàng không, hoặc deliveryType có phải là "Tự vận chuyển" (ID 1) không
            boolean isReceivingAtStore = (model.getIsDeliver() != null && model.getIsDeliver().equals(YesNoEnum.NO.getValue())) ||
                    (deliveryTypeId != null && deliveryTypeId == 1);

            if (isReceivingAtStore) {
                deliveryTypeId = 1; // Xác nhận là "Tự vận chuyển"
                // Nếu thanh toán ngay (không phải COD/trả sau)
                if (!"PAY000003".equals(paymentEntity.getCode())) {
                    statusEnum = OrderStatusEnum.ORDER_STATUS_SUCCESS; // Hoàn thành ngay
                } else {
                    // Thanh toán sau (ví dụ: đặt cọc rồi trả phần còn lại khi nhận, hoặc hình thức khác)
                    statusEnum = OrderStatusEnum.ORDER_STATUS_ACCEPT; // Cần xác nhận/xử lý thêm
                }
            } else {
                // Khách tại quầy nhưng YÊU CẦU GIAO HÀNG
                if (deliveryTypeId == null || deliveryTypeId == 1) { // Nếu chưa chọn hoặc chọn nhầm là tự VC
                    deliveryTypeId = 2; // Mặc định là "Giao hàng nhanh" (ID: 2) khi cần giao
                }
                // Vì cần giao hàng, nên trạng thái ban đầu sẽ là cần xử lý/xác nhận
                // (Ngay cả khi thanh toán trước, vẫn cần các bước chuẩn bị giao)
                statusEnum = OrderStatusEnum.ORDER_STATUS_ACCEPT; // Hoặc WAITING_ACCEPT nếu quy trình có bước đó
            }
        }
        // 2. Xử lý Đơn hàng Online - Type 2
        else if (model.getType() == 2) {
            if (deliveryTypeId == null) {
                deliveryTypeId = 2; // Mặc định "Giao hàng nhanh" (ID: 2) cho đơn online nếu chưa có
            }
            // Đơn online luôn cần xác nhận/chờ xử lý, bất kể hình thức thanh toán
            statusEnum = OrderStatusEnum.ORDER_STATUS_WAITING_ACCEPT;
        }
        // 3. Xử lý các loại đơn hàng khác hoặc trường hợp không xác định rõ ràng (fallback)
        else {
            // Logic này dựa trên isDeliver, tương tự như code gốc của bạn cho nhánh "else"
            // (Có thể giữ nguyên hoặc điều chỉnh nếu có các 'type' khác cụ thể)
            if (model.getIsDeliver() != null && model.getIsDeliver().equals(YesNoEnum.NO.getValue())) {
                if (deliveryTypeId == null) deliveryTypeId = 1;
                if (!"PAY000003".equals(paymentEntity.getCode())) {
                    statusEnum = OrderStatusEnum.ORDER_STATUS_SUCCESS;
                } else {
                    statusEnum = OrderStatusEnum.ORDER_STATUS_ACCEPT;
                }
            } else {
                if (deliveryTypeId == null) deliveryTypeId = 2;
                statusEnum = OrderStatusEnum.ORDER_STATUS_ACCEPT;
            }
        }

        log.info("Xác định trạng thái đơn hàng ban đầu: {} cho đơn loại {} (Payment: {}, DeliveryTypeID: {}, IsDeliver: {})",
                statusEnum, model.getType(), paymentEntity.getCode(), deliveryTypeId, model.getIsDeliver());
        return Pair.of(statusEnum, deliveryTypeId);
    }
    @Override
    public BaseListResponseModel<OrderGetListMapper> getListOrders(
            Integer userId, Integer paymentId, Integer employeeId,
            Integer status, Integer stage, Integer type,
            Integer startPrice, Integer endPrice,
            LocalDateTime startDate, LocalDateTime endDate,
            Pageable pageable) {
        BaseListResponseModel<OrderGetListMapper> response = new BaseListResponseModel<>();
        try {
            Page<OrderGetListMapper> orderPage = orderRepository.getListOrder(
                    userId, paymentId, employeeId, status, stage, type,
                    startPrice, endPrice, startDate, endDate, pageable
            );
            int currentPageIndex = pageable.getPageNumber() + 1;
            int currentPageSize = pageable.getPageSize();
            List<OrderGetListMapper> content = orderPage.getContent();
            int totalElements = (int) orderPage.getTotalElements();
            if (content.isEmpty()) {
                response.successResponse(new ArrayList<>(), 0, "Danh sách đơn hàng trống", currentPageIndex, currentPageSize);
            } else {
                response.successResponse(content, totalElements, "Lấy danh sách đơn hàng thành công", currentPageIndex, currentPageSize);
            }
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách đơn hàng: {}", e.getMessage(), e);
            response.errorResponse("Lỗi khi lấy danh sách đơn hàng: " + e.getMessage(),
                    pageable.getPageNumber() + 1,
                    pageable.getPageSize());
        }
        return response;
    }

    @Override
    public BaseResponseModel<String> generateCode() {
        BaseResponseModel<String> response = new BaseResponseModel<>();
        try {
            Integer idLastest = orderRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            response.successResponse(utilService.getGenderCode("ODR", idLastest), "Tạo mã đơn hàng thành công");
        } catch (Exception e) {
            log.error("Lỗi khi tạo mã đơn hàng: {}", e.getMessage(), e);
            response.errorResponse("Lỗi khi tạo mã đơn hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public BaseResponseModel<Integer> updateStatus(Integer id, OrderStatusEnum newStatusEnum, String note) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            OrderEntity orderEntity = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại với ID: " + id));
            UserEntity currentUserLogin = authenticationService.authenToken();
            if (currentUserLogin == null) throw new BadRequestException("Xác thực người dùng thất bại.");

            OrderStatusEnum oldStatusEnum = OrderStatusEnum.fromValue(orderEntity.getStatus());
            if (oldStatusEnum == OrderStatusEnum.ORDER_STATUS_SUCCESS && (newStatusEnum != OrderStatusEnum.ORDER_STATUS_SUCCESS)) throw new BadRequestException("Không thể chuyển đơn hàng đã hoàn thành về trạng thái trước đó.");
            if ((oldStatusEnum == OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL || oldStatusEnum == OrderStatusEnum.ORDER_STATUS_SHOP_CANCEL || oldStatusEnum == OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE) &&
                    (newStatusEnum != OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL && newStatusEnum != OrderStatusEnum.ORDER_STATUS_SHOP_CANCEL && newStatusEnum != OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE)) {
                throw new BadRequestException("Không thể thay đổi trạng thái của đơn hàng đã bị hủy.");
            }

            orderEntity.setStatus(newStatusEnum.getValue());
            orderEntity.setDescription(newStatusEnum.getDescription());
            orderEntity.setUpdatedBy(currentUserLogin.getId());
            orderEntity.setUpdatedDate(LocalDateTime.now());
            OrderEntity updatedOrder = orderRepository.save(orderEntity);

            LogActionOrderEntity logAction = new LogActionOrderEntity(null, updatedOrder, currentUserLogin, newStatusEnum.getDescription(), StringUtils.hasText(note) ? note : newStatusEnum.getDescription(), newStatusEnum.getValue(), LocalDateTime.now(), currentUserLogin.getFullName());
            logActionOrderRepository.save(logAction);

            List<ProductEntity> productsToUpdateStock = new ArrayList<>();
            if (newStatusEnum.equals(OrderStatusEnum.ORDER_STATUS_ACCEPT) && (oldStatusEnum.equals(OrderStatusEnum.ORDER_STATUS_WAITING_ACCEPT))) {
                List<OrderDetailEntity> orderDetails = orderDetailRepository.findByOrder(updatedOrder);
                for (OrderDetailEntity detail : orderDetails) {
                    ProductEntity product = detail.getProduct();
                    if (product.getStock() < detail.getQuantity()) throw new InsufficientStockException("Không đủ tồn kho cho sản phẩm " + product.getName() + ". Tồn kho: " + product.getStock() + ", Cần: " + detail.getQuantity());
                    int newStock = product.getStock() - detail.getQuantity();
                    product.setStock(newStock);
                    if (newStock == 0 && product.getStatus() != null && product.getStatus() == 1) product.setStatus(0);
                    productsToUpdateStock.add(product);
                }
                if (updatedOrder.getCouponId() != null) {
                    CouponEntity coupon = couponRepository.findById(updatedOrder.getCouponId()).orElse(null);
                    if(coupon != null && coupon.getQuantityUsed() < coupon.getQuantity()){
                        coupon.setQuantityUsed(coupon.getQuantityUsed() + 1);
                        couponRepository.save(coupon);
                    }
                }
            } else if (newStatusEnum.equals(OrderStatusEnum.ORDER_STATUS_SUCCESS)) {
                LogPaymentHistoryEntity logPayment = logPaymentHistoryRepository.findByOrderId(id);
                if (logPayment != null) {
                    if (logPayment.getStatus() == 0) {
                        logPayment.setAmount(updatedOrder.getTotalPrice());
                        logPayment.setStatus(1);
                        logPayment.setDescription("Đã thanh toán khi đơn hàng thành công");
                        logPaymentHistoryRepository.save(logPayment);
                    } else if (logPayment.getStatus() == 1 &&
                            updatedOrder.getTotalPrice() != null && logPayment.getAmount() != null &&
                            Math.abs(logPayment.getAmount().doubleValue() - updatedOrder.getTotalPrice().doubleValue()) > 0.001) {
                        log.warn("Đơn hàng ID {} đã được ghi nhận thanh toán với số tiền {}, nhưng totalPrice cuối cùng khi hoàn thành là {}. Cần kiểm tra lại.",
                                id, logPayment.getAmount(), updatedOrder.getTotalPrice());
                    }
                } else {
                    LogPaymentHistoryEntity newLogPayment = new LogPaymentHistoryEntity();
                    newLogPayment.setOrder(updatedOrder);
                    newLogPayment.setUser(currentUserLogin);
                    newLogPayment.setAmount(updatedOrder.getTotalPrice());
                    newLogPayment.setStatus(1);
                    newLogPayment.setDescription("Thanh toán khi nhận hàng (COD) - Đơn hàng thành công");
                    newLogPayment.setCreatedDate(LocalDateTime.now());
                    logPaymentHistoryRepository.save(newLogPayment);
                }
            } else if ((newStatusEnum.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) || newStatusEnum.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE) || newStatusEnum.equals(OrderStatusEnum.ORDER_STATUS_SHOP_CANCEL)) &&
                    !(oldStatusEnum.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL) || oldStatusEnum.equals(OrderStatusEnum.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE) || oldStatusEnum.equals(OrderStatusEnum.ORDER_STATUS_SHOP_CANCEL)) &&
                    (oldStatusEnum.getValue() >= OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue() && oldStatusEnum != OrderStatusEnum.ORDER_STATUS_SUCCESS)) {
                List<OrderDetailEntity> orderDetails = orderDetailRepository.findByOrder(updatedOrder);
                for (OrderDetailEntity detail : orderDetails) {
                    ProductEntity product = detail.getProduct();
                    if (product != null) {
                        int stockToReturn = detail.getQuantity();
                        product.setStock(product.getStock() + stockToReturn);
                        if (product.getStock() > 0 && product.getStatus() != null && product.getStatus() == 0) product.setStatus(1);
                        productsToUpdateStock.add(product);
                    }
                }
                if (updatedOrder.getCouponId() != null) {
                    CouponEntity coupon = couponRepository.findById(updatedOrder.getCouponId()).orElse(null);
                    if(coupon != null && coupon.getQuantityUsed() > 0){
                        coupon.setQuantityUsed(coupon.getQuantityUsed() - 1);
                        couponRepository.save(coupon);
                    }
                }
            }
            if (!productsToUpdateStock.isEmpty()) productRepository.saveAll(productsToUpdateStock.stream().distinct().collect(Collectors.toList()));
            response.successResponse(id, "Cập nhật trạng thái thành công");
        } catch (ResourceNotFoundException | InsufficientStockException | BadRequestException e) {
            log.warn("Lỗi nghiệp vụ khi cập nhật trạng thái đơn hàng ID {}: {}", id, e.getMessage());
            response.errorResponse(e.getMessage());
        } catch (Exception e) {
            log.error("Lỗi không xác định khi cập nhật trạng thái đơn hàng ID {}: {}", id, e.getMessage(), e);
            response.errorResponse("Lỗi không xác định khi cập nhật trạng thái đơn hàng.");
        }
        return response;
    }

    public String generateCode(Integer mark) {
        try {
            Integer idLastest = orderRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            return utilService.getGenderCode("ODR", idLastest);
        } catch (Exception e) {
            log.error("Lỗi khi tạo mã cho generateCode(Integer mark): {}", e.getMessage(), e);
            return null;
        }
    }

    @Override
    @Transactional
    public BaseResponseModel<Integer> updateOrderInformation(Integer orderId, OrderUpdateRequest updateRequest) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        UserEntity currentUserLogin = null;
        log.info("BẮT ĐẦU updateOrderInformation, orderId={}, updateRequest={}", orderId, updateRequest);
        try {
            log.debug("Tìm kiếm đơn hàng theo ID: {}", orderId);
            OrderEntity orderEntity = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

            log.debug("Xác thực người dùng đang đăng nhập...");
            currentUserLogin = authenticationService.authenToken();
            if (currentUserLogin == null) {
                log.warn("Xác thực thất bại!");
                throw new BadRequestException("Xác thực người dùng thất bại.");
            }
            log.info("Người dùng hiện tại: {}", currentUserLogin.getUsername());

            Integer currentStatusValue = orderEntity.getStatus();
            log.info("Trạng thái đơn hàng: {}", currentStatusValue);

            if (!(currentStatusValue.equals(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue()) ||
                    currentStatusValue.equals(OrderStatusEnum.ORDER_STATUS_DELIVERY.getValue()) ||
                    currentStatusValue.equals(OrderStatusEnum.ORDER_STATUS_WAITING_ACCEPT.getValue()))) {
                log.warn("Đơn hàng không ở trạng thái cho phép cập nhật: {}", currentStatusValue);
                throw new BadRequestException("Đơn hàng không ở trạng thái cho phép cập nhật thông tin (Trạng thái hiện tại: " + OrderStatusEnum.fromValue(currentStatusValue).getDescription() + ").");
            }

            boolean hasOverallChanges = false;
            StringBuilder changesLog = new StringBuilder("Các thay đổi: ");
            LocalDateTime now = LocalDateTime.now();

            // 1. Cập nhật thông tin khách hàng (nếu có)
            if (updateRequest.getCustomerInfo() != null) {
                log.debug("Có yêu cầu cập nhật thông tin khách hàng.");
                UserEntity customerUser = orderEntity.getUser();
                if (customerUser == null) {
                    log.warn("Không tìm thấy thông tin khách hàng cho đơn hàng ID: {}", orderId);
                    throw new ResourceNotFoundException("Không tìm thấy thông tin khách hàng cho đơn hàng ID: " + orderId);
                }
                OrderUpdateRequest.CustomerInfoUpdate customerInfoUpdate = updateRequest.getCustomerInfo();
                boolean customerDetailsChanged = false;

                if (StringUtils.hasText(customerInfoUpdate.getFullName()) && !customerInfoUpdate.getFullName().equals(customerUser.getFullName())) {
                    changesLog.append("Tên KH: '").append(customerUser.getFullName()).append("' -> '").append(customerInfoUpdate.getFullName()).append("'. ");
                    customerUser.setFullName(customerInfoUpdate.getFullName());
                    customerDetailsChanged = true;
                }
                if (StringUtils.hasText(customerInfoUpdate.getPhoneNumber()) && !customerInfoUpdate.getPhoneNumber().equals(customerUser.getPhoneNumber())) {
                    changesLog.append("SĐT KH: '").append(customerUser.getPhoneNumber()).append("' -> '").append(customerInfoUpdate.getPhoneNumber()).append("'. ");
                    customerUser.setPhoneNumber(customerInfoUpdate.getPhoneNumber());
                    customerDetailsChanged = true;
                }
                if (customerDetailsChanged) {
                    customerUser.setUpdatedBy(currentUserLogin.getId());
                    customerUser.setUpdatedDate(now);
                    userRepository.save(customerUser);
                    hasOverallChanges = true;
                }
            }
            // 2. Cập nhật thông tin địa chỉ giao hàng (ưu tiên addressInfo nếu có)
            if (updateRequest.getAddressInfo() != null) {
                log.debug("Có yêu cầu cập nhật thông tin địa chỉ từ addressInfo.");
                OrderUpdateRequest.AddressInfoUpdate addressUpdate = updateRequest.getAddressInfo();
                AddressEntity shippingAddress = orderEntity.getAddress();
                boolean addressEntityChanged = false;

                // Trường hợp đơn hàng chưa có địa chỉ và cần tạo mới
                if (shippingAddress == null && orderEntity.getDeliveryType() != null && orderEntity.getDeliveryType().getId() != 1 &&
                        (addressUpdate.getProvinceId() != null || StringUtils.hasText(addressUpdate.getAddressDetail()))) {
                    log.info("Đơn hàng ID {} chưa có địa chỉ, tạo mới từ addressInfo.", orderId);
                    shippingAddress = new AddressEntity();
                    shippingAddress.setUserEntity(orderEntity.getUser());
                    shippingAddress.setCreatedBy(currentUserLogin.getId());
                    shippingAddress.setCreatedDate(now);
                    shippingAddress.setStatus(1);
                    shippingAddress.setIsDeleted(0);

                    // QUAN TRỌNG: Lưu AddressEntity mới ngay tại đây để nó có ID và trở thành persistent
                    // TRƯỚC KHI gán vào OrderEntity hoặc thực hiện các truy vấn khác có thể trigger flush
                    // Tuy nhiên, chúng ta cần gán các thuộc tính tỉnh/huyện/xã/chi tiết TRƯỚC KHI LƯU LẦN ĐẦU
                    // Do đó, việc gán vào orderEntity trước rồi lưu cả cụm ở cuối có thể tốt hơn nếu cascade đúng.
                    // Nhưng nếu lỗi vẫn xảy ra, hãy thử lưu AddressEntity riêng lẻ sớm hơn.

                    // Tạm thời giữ nguyên logic gán vào orderEntity trước, rồi lưu ở cuối.
                    // Lỗi có thể do thứ tự flush của Hibernate khi gọi các findByCode.
                    orderEntity.setAddress(shippingAddress);
                }

                if (shippingAddress != null) { // shippingAddress giờ đây có thể là cái mới được tạo ở trên (chưa có ID) hoặc cái cũ
                    String oldProvinceName = (shippingAddress.getProvince() != null) ? shippingAddress.getProvince().getName() : "N/A";
                    String oldDistrictName = (shippingAddress.getDistrict() != null) ? shippingAddress.getDistrict().getName() : "N/A";
                    String oldWardName = (shippingAddress.getWard() != null) ? shippingAddress.getWard().getName() : "N/A";
                    String oldAddressDetail = shippingAddress.getAddressDetail() != null ? shippingAddress.getAddressDetail() : "";

                    // Cập nhật Tỉnh/Thành phố
                    String provinceCodeRequest = String.valueOf(addressUpdate.getProvinceId());
                    if (addressUpdate.getProvinceId() != null &&
                            (shippingAddress.getProvince() == null || !provinceCodeRequest.equals(shippingAddress.getProvince().getCode()))) {

                        // Nếu shippingAddress là mới (chưa có ID), nó cần được lưu TRƯỚC khi các quan hệ được thiết lập và lưu.
                        // Hoặc, đảm bảo OrderEntity có CascadeType.PERSIST hoặc ALL cho 'address'.
                        if (shippingAddress.getId() == null) {
                            // Gán các giá trị cơ bản trước khi tìm tỉnh/huyện/xã
                            if (StringUtils.hasText(addressUpdate.getAddressDetail())) {
                                shippingAddress.setAddressDetail(addressUpdate.getAddressDetail());
                            }
                            // Lưu AddressEntity để nó có ID
                            log.info("Lưu AddressEntity mới (chưa có tỉnh/huyện/xã) để lấy ID.");
                            addressRepository.save(shippingAddress); // LƯU SỚM
                            // Sau khi lưu, shippingAddress sẽ có ID
                        }

                        ProvincesEntity newProvince = addressRepository.findProvinceByCode(provinceCodeRequest)
                                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Tỉnh/Thành phố với mã: " + provinceCodeRequest));
                        shippingAddress.setProvince(newProvince);
                        changesLog.append("Tỉnh/TP: '").append(oldProvinceName).append("' -> '").append(newProvince.getName()).append("'. ");
                        addressEntityChanged = true;
                    }

                    // Tương tự cho District và Ward, nếu shippingAddress.getId() == null, nó đã được lưu ở trên
                    String districtCodeRequest = String.valueOf(addressUpdate.getDistrictId());
                    if (addressUpdate.getDistrictId() != null &&
                            (shippingAddress.getDistrict() == null || !districtCodeRequest.equals(shippingAddress.getDistrict().getCode()))) {
                        DistrictEntity newDistrict = addressRepository.findDistrictByCode(districtCodeRequest)
                                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Quận/Huyện với mã: " + districtCodeRequest));
                        shippingAddress.setDistrict(newDistrict);
                        changesLog.append("Quận/Huyện: '").append(oldDistrictName).append("' -> '").append(newDistrict.getName()).append("'. ");
                        addressEntityChanged = true;
                    }

                    String wardCodeRequest = String.valueOf(addressUpdate.getWardId());
                    if (addressUpdate.getWardId() != null &&
                            (shippingAddress.getWard() == null || !wardCodeRequest.equals(shippingAddress.getWard().getCode()))) {
                        WardEntity newWard = addressRepository.findWardByCode(wardCodeRequest)
                                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Xã/Phường với mã: " + wardCodeRequest));
                        shippingAddress.setWard(newWard);
                        changesLog.append("Xã/Phường: '").append(oldWardName).append("' -> '").append(newWard.getName()).append("'. ");
                        addressEntityChanged = true;
                    }

                    // Cập nhật địa chỉ chi tiết (nếu chưa được set ở trên khi tạo mới)
                    if (StringUtils.hasText(addressUpdate.getAddressDetail()) && !addressUpdate.getAddressDetail().equals(shippingAddress.getAddressDetail())) {
                        shippingAddress.setAddressDetail(addressUpdate.getAddressDetail());
                        changesLog.append("Địa chỉ chi tiết: '").append(oldAddressDetail).append("' -> '").append(shippingAddress.getAddressDetail()).append("'. ");
                        addressEntityChanged = true;
                    }


                    if (addressEntityChanged) {
                        log.info("Thông tin địa chỉ đã thay đổi.");
                        shippingAddress.setUpdatedBy(currentUserLogin.getId());
                        shippingAddress.setUpdatedDate(now);
                        // Không cần lưu shippingAddress ở đây nữa nếu đã lưu sớm hoặc sẽ lưu ở cuối
                        hasOverallChanges = true;
                    }
                }
            }
            // Phần xử lý customerInfo.getShippingAddress() đã bị loại bỏ để ưu tiên addressInfo.
            // Nếu bạn vẫn muốn giữ nó như một fallback, bạn có thể thêm lại logic đó ở đây.

            // 3. Cập nhật danh sách sản phẩm
            double newCalculatedRealPrice = 0;
            List<ProductEntity> productsToUpdateStock = new ArrayList<>();
            boolean productListChanged = false;

            List<OrderDetailEntity> existingOrderDetails = orderDetailRepository.findByOrder(orderEntity);
            // Nếu không có yêu cầu cập nhật sản phẩm, tính realPrice từ các chi tiết hiện có
            if (updateRequest.getProducts() == null || updateRequest.getProducts().isEmpty()) {
                newCalculatedRealPrice = existingOrderDetails.stream()
                        .mapToDouble(detail -> detail.getPrice() * detail.getQuantity())
                        .sum();
                log.debug("Không có cập nhật sản phẩm, realPrice tính từ chi tiết hiện tại: {}", newCalculatedRealPrice);
            } else {
                log.info("Có yêu cầu cập nhật danh sách sản phẩm.");
                Map<Integer, OrderDetailEntity> existingDetailsMap = existingOrderDetails.stream()
                        .collect(Collectors.toMap(detail -> detail.getProduct().getId(), Function.identity()));
                List<OrderDetailEntity> finalOrderDetailsToSaveOrUpdate = new ArrayList<>();
                List<OrderDetailEntity> orderDetailsToDelete = new ArrayList<>();

                for (OrderUpdateRequest.ProductItemUpdate productUpdateItem : updateRequest.getProducts()) {
                    Integer productId = productUpdateItem.getProductId();
                    int requestedQuantity = productUpdateItem.getQuantity();

                    ProductEntity product = productRepository.findById(productId)
                            .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm ID: " + productId + " không tồn tại."));
                    double effectiveProductPrice = productService.getEffectivePrice(productId, now);
                    double originalProductPrice = getBasePriceFromProductEntity(product);
                    OrderDetailEntity existingDetail = existingDetailsMap.remove(productId); // Lấy và xóa khỏi map để theo dõi những cái không được cập nhật

                    if (requestedQuantity <= 0) { // Nếu số lượng yêu cầu là 0 hoặc âm, nghĩa là xóa sản phẩm
                        if (existingDetail != null) {
                            log.info("Xóa sản phẩm ID {} khỏi đơn hàng (SL cũ: {})", productId, existingDetail.getQuantity());
                            if (currentStatusValue.equals(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue()) ||
                                    currentStatusValue.equals(OrderStatusEnum.ORDER_STATUS_DELIVERY.getValue())) { // Chỉ hoàn kho nếu đã trừ
                                product.setStock(product.getStock() + existingDetail.getQuantity());
                                if (product.getStock() > 0 && product.getStatus() != null && product.getStatus() == 0) product.setStatus(1);
                                productsToUpdateStock.add(product);
                            }
                            orderDetailsToDelete.add(existingDetail);
                            changesLog.append("Xóa SP ID ").append(productId).append(" (SL cũ:").append(existingDetail.getQuantity()).append("). ");
                            productListChanged = true;
                        }
                        continue; // Chuyển sang sản phẩm tiếp theo
                    }

                    // Nếu sản phẩm đã có trong đơn hàng
                    if (existingDetail != null) {
                        int oldQuantity = existingDetail.getQuantity();
                        double oldPrice = existingDetail.getPrice();
                        boolean quantityChanged = (requestedQuantity - oldQuantity) != 0;
                        boolean priceChanged = Math.abs(effectiveProductPrice - oldPrice) > 0.001; // So sánh giá

                        if (quantityChanged || priceChanged) {
                            log.info("Cập nhật SP ID {}: SL {}->{}, Giá {}->{}", productId, oldQuantity, requestedQuantity, oldPrice, effectiveProductPrice);
                            if (quantityChanged) {
                                if (currentStatusValue.equals(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue()) ||
                                        currentStatusValue.equals(OrderStatusEnum.ORDER_STATUS_DELIVERY.getValue())) {
                                    int quantityDifference = requestedQuantity - oldQuantity;
                                    if (quantityDifference > 0 && product.getStock() < quantityDifference) { // Cần thêm
                                        log.warn("Không đủ tồn kho cho sản phẩm {}. Tồn: {}, cần thêm: {}", product.getName(), product.getStock(), quantityDifference);
                                        throw new InsufficientStockException("Không đủ tồn kho cho " + product.getName() + ". Tồn: " + product.getStock() + ", Cần thêm: " + quantityDifference);
                                    }
                                    product.setStock(product.getStock() - quantityDifference); // Trừ hoặc cộng lại vào stock
                                    if (product.getStock() == 0 && product.getStatus() != null && product.getStatus() == 1) product.setStatus(0);
                                    else if (product.getStock() > 0 && product.getStatus() != null && product.getStatus() == 0) product.setStatus(1);
                                    productsToUpdateStock.add(product);
                                }
                                changesLog.append("Cập nhật SL SP ID ").append(productId).append(": ").append(oldQuantity).append("->").append(requestedQuantity).append(". ");
                            }
                            if (priceChanged) {
                                changesLog.append("Cập nhật Giá SP ID ").append(productId).append(": ").append(formatCurrency(oldPrice)).append("->").append(formatCurrency(effectiveProductPrice)).append(". ");
                            }

                            existingDetail.setQuantity(requestedQuantity);
                            existingDetail.setPrice(effectiveProductPrice);
                            existingDetail.setOriginPrice(originalProductPrice);
                            existingDetail.setTotal((int) Math.round(effectiveProductPrice * requestedQuantity));
                            existingDetail.setUpdatedBy(currentUserLogin.getId());
                            existingDetail.setUpdatedDate(now);
                            productListChanged = true;
                        }
                        finalOrderDetailsToSaveOrUpdate.add(existingDetail);
                    } else { // Thêm mới sản phẩm vào đơn hàng
                        log.info("Thêm mới sản phẩm ID {} vào đơn hàng, SL: {}", productId, requestedQuantity);
                        if (currentStatusValue.equals(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue()) ||
                                currentStatusValue.equals(OrderStatusEnum.ORDER_STATUS_DELIVERY.getValue())) {
                            if (product.getStock() < requestedQuantity) {
                                log.warn("Không đủ tồn kho cho sản phẩm {}. Tồn: {}, Cần: {}", product.getName(), product.getStock(), requestedQuantity);
                                throw new InsufficientStockException("Không đủ tồn kho cho " + product.getName() + ". Tồn: " + product.getStock() + ", Cần: " + requestedQuantity);
                            }
                            product.setStock(product.getStock() - requestedQuantity);
                            if (product.getStock() == 0 && product.getStatus() != null && product.getStatus() == 1) product.setStatus(0);
                            productsToUpdateStock.add(product);
                        }
                        OrderDetailEntity newDetail = new OrderDetailEntity(null, product, orderEntity, requestedQuantity,
                                (int) Math.round(effectiveProductPrice * requestedQuantity),
                                now, currentUserLogin.getId(), now, currentUserLogin.getId(),
                                1, 0, effectiveProductPrice, originalProductPrice);
                        finalOrderDetailsToSaveOrUpdate.add(newDetail);
                        changesLog.append("Thêm SP ID ").append(productId).append(" (SL:").append(requestedQuantity).append(", Giá:").append(formatCurrency(effectiveProductPrice)).append("). ");
                        productListChanged = true;
                    }
                    newCalculatedRealPrice += effectiveProductPrice * requestedQuantity;
                }

                // Xử lý các sản phẩm còn lại trong existingDetailsMap (nghĩa là bị xóa khỏi đơn hàng vì không có trong request mới)
                if (!existingDetailsMap.isEmpty()) {
                    log.info("Các sản phẩm sau bị xóa khỏi đơn hàng vì không có trong request mới: {}", existingDetailsMap.keySet());
                    for (OrderDetailEntity detailToRemove : existingDetailsMap.values()) {
                        if (currentStatusValue.equals(OrderStatusEnum.ORDER_STATUS_ACCEPT.getValue()) ||
                                currentStatusValue.equals(OrderStatusEnum.ORDER_STATUS_DELIVERY.getValue())) {
                            ProductEntity productToRemove = detailToRemove.getProduct();
                            productToRemove.setStock(productToRemove.getStock() + detailToRemove.getQuantity());
                            if (productToRemove.getStock() > 0 && productToRemove.getStatus() != null && productToRemove.getStatus() == 0) productToRemove.setStatus(1);
                            if (!productsToUpdateStock.contains(productToRemove)) productsToUpdateStock.add(productToRemove);
                        }
                        orderDetailsToDelete.add(detailToRemove);
                        changesLog.append("Xóa SP ID ").append(detailToRemove.getProduct().getId()).append(" (không có trong YC, SL cũ:").append(detailToRemove.getQuantity()).append("). ");
                        productListChanged = true;
                    }
                }

                if (productListChanged) {
                    log.info("Lưu lại các thay đổi về sản phẩm trong đơn hàng.");
                    if (!orderDetailsToDelete.isEmpty()) {
                        orderDetailRepository.deleteAll(orderDetailsToDelete);
                    }
                    if (!finalOrderDetailsToSaveOrUpdate.isEmpty()) {
                        orderDetailRepository.saveAll(finalOrderDetailsToSaveOrUpdate);
                    }
                    if (!CollectionUtils.isEmpty(productsToUpdateStock)) {
                        productRepository.saveAll(productsToUpdateStock.stream().distinct().collect(Collectors.toList()));
                    }
                    hasOverallChanges = true; // Đặt hasOverallChanges nếu productListChanged
                }
                orderEntity.setRealPrice((int) Math.round(newCalculatedRealPrice));
                log.debug("Tính lại realPrice mới sau khi cập nhật sản phẩm: {}", newCalculatedRealPrice);
            }


            // 4. Tính toán lại tổng tiền và cập nhật LogPaymentHistory nếu có thay đổi
            if (hasOverallChanges) { // Chỉ tính lại nếu có bất kỳ thay đổi nào ở trên
                log.info("Có thay đổi tổng thể, tính lại totalPrice...");
                double finalNewTotalPrice = orderEntity.getRealPrice(); // Bắt đầu từ realPrice đã được cập nhật

                if (orderEntity.getCouponId() != null) {
                    CouponEntity coupon = couponRepository.findById(orderEntity.getCouponId()).orElse(null);
                    if (coupon != null && orderEntity.getRealPrice() >= coupon.getMinValue()) {
                        double discount = 0;
                        if (coupon.getType() != null) {
                            if (coupon.getType().equals(com.example.backend_comic_service.develop.enums.CouponTypeEnum.COUPON_PERCENT.getValue())) {
                                discount = orderEntity.getRealPrice() * (coupon.getPercentValue() / 100.0);
                                if (coupon.getMaxValue() != null && discount > coupon.getMaxValue()) discount = coupon.getMaxValue();
                            } else if (coupon.getType().equals(com.example.backend_comic_service.develop.enums.CouponTypeEnum.COUPON_AMOUNT.getValue())) {
                                discount = coupon.getCouponAmount();
                            }
                        }
                        if (discount > 0) {
                            finalNewTotalPrice -= discount;
                            log.info("Áp dụng coupon ID {}, giảm giá: {}", coupon.getId(), formatCurrency(discount));
                        }
                    } else if (coupon != null) {
                        log.info("Coupon ID {} không đủ điều kiện áp dụng lại với realPrice mới.", coupon.getId());
                    }
                }

                if (orderEntity.getFeeDelivery() != null) {
                    log.info("Cộng thêm phí vận chuyển: {}", orderEntity.getFeeDelivery());
                    finalNewTotalPrice += orderEntity.getFeeDelivery();
                }

                double oldTotalPrice = orderEntity.getTotalPrice() != null ? orderEntity.getTotalPrice() : 0.0;
                orderEntity.setTotalPrice(finalNewTotalPrice < 0 ? 0.0 : finalNewTotalPrice);
                if (Math.abs(oldTotalPrice - orderEntity.getTotalPrice()) > 0.001) { // Chỉ ghi log nếu tổng tiền thực sự thay đổi
                    changesLog.append("Tổng tiền: ").append(formatCurrency(oldTotalPrice)).append(" -> ").append(formatCurrency(orderEntity.getTotalPrice())).append(". ");
                }
                log.info("Tổng tiền đơn hàng sau khi tính lại: {}", formatCurrency(orderEntity.getTotalPrice()));

                LogPaymentHistoryEntity logPayment = logPaymentHistoryRepository.findByOrderId(orderId);
                if (logPayment != null) {
                    if (logPayment.getStatus() == 0) { // Nếu đang chờ thanh toán
                        if (logPayment.getAmount() == null || Math.abs(logPayment.getAmount().doubleValue() - orderEntity.getTotalPrice().doubleValue()) > 0.001) {
                            changesLog.append("Cập nhật Log TT (chờ TT): ").append(formatCurrency(logPayment.getAmount())).append(" -> ").append(formatCurrency(orderEntity.getTotalPrice())).append(". ");
                            log.info("Cập nhật lại amount trong log payment (chờ TT) từ {} -> {}", formatCurrency(logPayment.getAmount()), formatCurrency(orderEntity.getTotalPrice()));
                            logPayment.setAmount(orderEntity.getTotalPrice());
                            logPaymentHistoryRepository.save(logPayment);
                        }
                    } else { // Đã thanh toán
                        if (orderEntity.getTotalPrice() != null && logPayment.getAmount() != null && Math.abs(logPayment.getAmount().doubleValue() - orderEntity.getTotalPrice().doubleValue()) > 0.001) {
                            log.warn("Đơn hàng ID {} đã thanh toán với số tiền {}, nhưng tổng tiền mới là {}. Cần xử lý nghiệp vụ chênh lệch.", orderId, formatCurrency(logPayment.getAmount()), formatCurrency(orderEntity.getTotalPrice()));
                            changesLog.append("CẢNH BÁO: Đơn đã TT ").append(formatCurrency(logPayment.getAmount())).append(", tổng mới ").append(formatCurrency(orderEntity.getTotalPrice())).append(". ");
                        }
                    }
                } else if (orderEntity.getTotalPrice() > 0) { // Nếu chưa có log payment và tổng tiền > 0
                    log.warn("Không tìm thấy LogPaymentHistory cho đơn hàng ID {} khi cập nhật thông tin, nhưng tổng tiền mới là {}. Cân nhắc tạo log payment.", orderId, formatCurrency(orderEntity.getTotalPrice()));
                }
            }


            // 5. Lưu đơn hàng và ghi log hành động nếu có thay đổi
            if (hasOverallChanges) {
                log.info("Lưu lại trạng thái đơn hàng và ghi log hành động.");
                orderEntity.setUpdatedBy(currentUserLogin.getId());
                orderEntity.setUpdatedDate(now);

                // Lưu AddressEntity nếu nó được tạo mới hoặc thay đổi.
                // Nếu OrderEntity có CascadeType.ALL hoặc MERGE cho 'address', thì việc save orderEntity sẽ tự động save address.
                // Nếu không, cần lưu tường minh.
                if (orderEntity.getAddress() != null &&
                        (orderEntity.getAddress().getId() == null || // Địa chỉ mới chưa có ID
                                changesLog.toString().contains("Tỉnh/TP:") || // Hoặc có thay đổi cụ thể liên quan đến địa chỉ
                                changesLog.toString().contains("Quận/Huyện:") ||
                                changesLog.toString().contains("Xã/Phường:") ||
                                changesLog.toString().contains("Địa chỉ chi tiết:"))) {
                    log.info("Lưu AddressEntity (ID: {}).", orderEntity.getAddress().getId());
                    addressRepository.save(orderEntity.getAddress());
                }

                log.info("Lưu OrderEntity (ID: {}).", orderEntity.getId());
                orderRepository.save(orderEntity);

                String finalChangesMessage = changesLog.length() > "Các thay đổi: ".length() ? changesLog.toString().trim() : "Thông tin đơn hàng đã được cập nhật.";
                LogActionOrderEntity logAction = new LogActionOrderEntity(null, orderEntity, currentUserLogin,
                        "Cập nhật thông tin đơn hàng.",
                        finalChangesMessage,
                        orderEntity.getStatus(), now, currentUserLogin.getFullName());
                logActionOrderRepository.save(logAction);
                response.successResponse(orderId, "Cập nhật thông tin đơn hàng thành công.");
                log.info("Cập nhật đơn hàng thành công, orderId={}", orderId);
            } else {
                log.info("Không có thông tin nào được thay đổi. orderId={}", orderId);
                response.successResponse(orderId, "Không có thông tin nào được thay đổi.");
            }
            log.info("KẾT THÚC updateOrderInformation, response={}", response);
            return response;
        } catch (ResourceNotFoundException | InsufficientStockException | BadRequestException e) {
            log.warn("Lỗi nghiệp vụ khi cập nhật đơn hàng ID {}: {}", orderId, e.getMessage(), e);
            response.errorResponse(e.getMessage());
            return response;
        } catch (Exception e) {
            log.error("Lỗi không xác định khi cập nhật đơn hàng ID {}: {}", orderId, e.getMessage(), e);
            response.errorResponse("Lỗi không xác định khi cập nhật đơn hàng.");
            return response;
        }
    }

    // Helper method để format tiền tệ cho log (bạn có thể đã có hoặc dùng thư viện)
    private String formatCurrency(Double amount) {
        if (amount == null) return "N/A";
        // Ví dụ đơn giản, bạn có thể dùng NumberFormat cho chuẩn hơn
        java.text.DecimalFormat formatter = new java.text.DecimalFormat("#,###");
        return formatter.format(amount) + " VND";
    }



    private double getBasePriceFromProductEntity(ProductEntity product) {
        if (product == null) {
            log.warn("getBasePriceFromProductEntity được gọi với product là null.");
            return 0.0;
        }
        if (product.getPriceDiscount() > 0) {
            return product.getPriceDiscount();
        }
        if (product.getPrice() > 0) {
            return product.getPrice();
        }
        log.warn("Sản phẩm ID {} có giá gốc (price) không hợp lệ (<= 0): {}", product.getId(), product.getPrice());
        return 0.0;
    }
}
