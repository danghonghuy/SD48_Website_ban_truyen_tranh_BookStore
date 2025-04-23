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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentValidator paymentValidator;
    private final UtilService utilService;
    private final AuthenticationService authenticationService;
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
                    response.errorResponse("Payment not exist to update");
                    return response;
                }
                paymentEntity.setName(paymentModel.getName());
                paymentEntity.setCode(paymentModel.getCode());
            }else{
                paymentEntity = paymentModel.toEntity();
            }

            UserEntity userEntity = authenticationService.authenToken();
            if(userEntity == null){
                response.errorResponse("Authentication failed");
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
                     response.successResponse(paymentModel, "Update successful");
                 }else{
                     response.successResponse(paymentModel, "Add successful");
                 }
                 return response;
            }else{
                if(paymentModel.getId() != null){
                    response.successResponse(null, "Update failed");
                }else{
                    response.successResponse(null, "Add failed");
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
                response.errorResponse("Payment not exist to update");
                return response;
            }
            PaymentModel paymentModel = paymentEntity.toModel();
            response.successResponse(paymentModel, "Get successful");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<List<PaymentModel>> getAllPayments(String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<List<PaymentModel>> response = new BaseListResponseModel<>();
        try{
            Page<PaymentEntity> paymentEntities = paymentRepository.getListPayments(keySearch, status, pageable);
            if(paymentEntities.getContent().isEmpty()){
                response.successResponse(null, "Payment list is empty");
                return response;
            }
            List<PaymentModel> paymentModels = paymentEntities.getContent().stream().map(PaymentEntity::toModel).toList();
            response.successResponse(paymentModels, "Get successful");
            response.setPageIndex(pageable.getPageNumber());
            response.setPageSize(pageable.getPageSize());
            response.setTotalCount((int) paymentEntities.getTotalElements());
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> delete(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            PaymentEntity paymentEntity = paymentRepository.findById(id).orElse(null);
            if(paymentEntity == null){
                response.errorResponse("Payment not exist to update");
                return response;
            }
            paymentRepository.updatePayment(paymentEntity.getId(), status);
            response.successResponse(id, "Delete successful");
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
            response.successResponse(codeGender, "Generate discount code success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
