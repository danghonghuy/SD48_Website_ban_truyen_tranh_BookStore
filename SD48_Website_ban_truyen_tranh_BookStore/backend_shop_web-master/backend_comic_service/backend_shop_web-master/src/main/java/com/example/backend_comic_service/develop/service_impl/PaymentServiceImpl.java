package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.PaymentEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.PaymentModel;
import com.example.backend_comic_service.develop.repository.PaymentRepository;
import com.example.backend_comic_service.develop.service.IPaymentService;
import com.example.backend_comic_service.develop.utils.AuthenticationService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.PaymentValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentValidator paymentValidator;
    private final UtilService utilService;
    private final AuthenticationService authenticationService;

    @Value("${momo.endpoint}")
    private String endPoint;

    @Value("${momo.partnerCode}")
    private String partnerCode;

    @Value("${momo.accessKey}")
    private String accessKey;

    @Value("${momo.secretKey}")
    private String secretKey;

    @Value("${ipUrl}")
    private String ipnUrl;

    @Value("${redirectUrl}")
    private String redirectUrl;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository, PaymentValidator paymentValidator, UtilService utilService, AuthenticationService authenticationService) {
        this.paymentRepository = paymentRepository;
        this.paymentValidator = paymentValidator;
        this.utilService = utilService;
        this.authenticationService = authenticationService;
    }

    @Override
    public BaseResponseModel<PaymentModel> addOrChange(PaymentModel paymentModel) {
        BaseResponseModel<PaymentModel> response = new BaseResponseModel<>();
        try{
            PaymentEntity paymentEntity = new PaymentEntity();
            String errorMessage = paymentValidator.validate(paymentModel);
            if(StringUtils.hasText(errorMessage)){
                response.errorResponse(errorMessage);
                return response;
            }
            if((paymentModel.getId() != null) && (paymentModel.getId() > 0)){
                 paymentEntity = paymentRepository.findById(paymentModel.getId()).orElse(null);
                if(paymentEntity == null){
                    response.errorResponse("Phương thức thanh toán không tồn tại để cập nhật");
                    return response;
                }
                paymentEntity.setName(paymentModel.getName());
                paymentEntity.setCode(paymentModel.getCode());
            }else{
                paymentEntity = paymentModel.toEntity();
            }

            UserEntity userEntity = authenticationService.authenToken();
            if(userEntity == null){
                response.errorResponse("Xác thực thất bại");
                return response;
            }
            if(Optional.ofNullable(paymentModel.getId()).orElse(0) <= 0){
                paymentEntity.setCreatedBy(userEntity.getId());
                paymentEntity.setCreatedDate(LocalDateTime.now());
            }
            paymentEntity.setUpdatedBy(userEntity.getId());
            paymentEntity.setUpdatedDate(LocalDateTime.now());
            PaymentEntity savedPaymentEntity = paymentRepository.saveAndFlush(paymentEntity);
            if(savedPaymentEntity.getId() != null){
                 if(paymentModel.getId() != null){
                     response.successResponse(paymentModel, "Cập nhật thành công");
                 }else{
                     response.successResponse(paymentModel, "Thêm thành công");
                 }
                 return response;
            }else{
                if(paymentModel.getId() != null){
                    response.successResponse(null, "Cập nhật thất bại");
                }else{
                    response.successResponse(null, "Thêm thất bại");
                }
                return response;
            }
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<PaymentModel> getPaymentById(Integer id) {
        BaseResponseModel<PaymentModel> response = new BaseResponseModel<>();
        try{
            PaymentEntity paymentEntity = paymentRepository.findById(id).orElse(null);
            if(paymentEntity == null){
                response.errorResponse("Phương thức thanh toán không tồn tại");
                return response;
            }
            PaymentModel paymentModel = paymentEntity.toModel();
            response.successResponse(paymentModel, "Lấy thành công");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<PaymentModel> getAllPayments(String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<PaymentModel> response = new BaseListResponseModel<>();
        try {
            Page<PaymentEntity> paymentEntityPage = paymentRepository.getListPayments(keySearch, status, pageable);

            List<PaymentModel> paymentModels = new ArrayList<>();
            int totalElements = 0;

            if (paymentEntityPage != null && !paymentEntityPage.getContent().isEmpty()) {
                paymentModels = paymentEntityPage.getContent().stream()
                        .map(PaymentEntity::toModel) // Giả sử PaymentEntity có toModel()
                        .collect(Collectors.toList());
                totalElements = (int) paymentEntityPage.getTotalElements();
            }

            int currentPageIndex = pageable.getPageNumber() + 1;
            int currentPageSize = pageable.getPageSize();

            if (paymentModels.isEmpty()) {
                response.successResponse(new ArrayList<>(), 0, "Danh sách phương thức thanh toán trống", currentPageIndex, currentPageSize);
            } else {
                response.successResponse(paymentModels, totalElements, "Lấy danh sách phương thức thanh toán thành công", currentPageIndex, currentPageSize);
            }

        } catch (Exception e) {
            // log.error("Lỗi khi lấy danh sách phương thức thanh toán: {}", e.getMessage(), e); // Nên có log
            response.errorResponse("Lỗi hệ thống khi lấy danh sách phương thức thanh toán: " + e.getMessage(),
                    pageable.getPageNumber() + 1,
                    pageable.getPageSize());
        }
        return response;
    }

    @Override
    public BaseResponseModel<Integer> delete(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            PaymentEntity paymentEntity = paymentRepository.findById(id).orElse(null);
            if(paymentEntity == null){
                response.errorResponse("Phương thức thanh toán không tồn tại");
                return response;
            }
            paymentRepository.updatePayment(paymentEntity.getId(), status);
            response.successResponse(id, "Xóa thành công");
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
            Integer idLastest =  paymentRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("PAY", idLastest);
            response.successResponse(codeGender, "Tạo mã thành công");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<String> payWithMomo(String orderId, BigDecimal amount) {

        BaseResponseModel<String> result  = new BaseResponseModel<>();

        String orderInfo = "Payment";
        String extraData = "";
        String requestId = String.valueOf(System.currentTimeMillis() + new Random().nextInt(999 - 111 + 1) + 111);
        String requestType = "captureWallet";
        String rawHash = "accessKey=" + accessKey +
                "&amount=" + amount.longValue() +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;
        String signature = hmacSHA256(rawHash, secretKey);

        Map<String, Object> data = new HashMap<>();
        data.put("partnerCode", partnerCode);
        data.put("partnerName", "Test");
        data.put("storeId", "MomoTestStore");
        data.put("requestId", requestId);
        data.put("amount", amount);
        data.put("orderId", orderId);
        data.put("orderInfo", orderInfo);
        data.put("redirectUrl", redirectUrl);
        data.put("ipnUrl", ipnUrl);
        data.put("lang", "vi");
        data.put("extraData", extraData);
        data.put("requestType", requestType);
        data.put("signature", signature);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(data, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(endPoint, entity, Map.class);

        Map<String, String> responseBody = response.getBody();

        result.setMessage(responseBody.get("payUrl"));

        return result;
    }


    private String hmacSHA256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(data.getBytes());

            StringBuilder sb = new StringBuilder();
            for (byte b : rawHmac) {
                sb.append(String.format("%02x", b));
            }

            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC SHA-256", e);
        }
    }

}
