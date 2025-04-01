package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.DeliveryEntity;
import com.example.backend_comic_service.develop.entity.PaymentEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DeliveryModel;
import com.example.backend_comic_service.develop.model.model.PaymentModel;
import com.example.backend_comic_service.develop.repository.DeliveryRepository;
import com.example.backend_comic_service.develop.service.IDeliveryService;
import com.example.backend_comic_service.develop.utils.AuthenticationService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.DeliveryValidator;
import com.example.backend_comic_service.develop.validator.PaymentValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class DeliveryServiceImpl implements IDeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final DeliveryValidator deliveryValidator;
    private final UtilService utilService;
    private final AuthenticationService authenticationService;
    @Autowired
    public DeliveryServiceImpl(DeliveryRepository deliveryRepository, DeliveryValidator deliveryValidator, UtilService utilService, AuthenticationService authenticationService) {
        this.deliveryRepository = deliveryRepository;
        this.deliveryValidator = deliveryValidator;
        this.utilService = utilService;
        this.authenticationService = authenticationService;
    }
    @Override
    public BaseListResponseModel<List<DeliveryModel>> getList(String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<List<DeliveryModel>> response = new BaseListResponseModel<>();
        try{
            Page<DeliveryEntity> deliveryEntities = deliveryRepository.getList(keySearch, status, pageable);
            if(deliveryEntities.getContent().isEmpty()){
                response.successResponse(null, "Payment list is empty");
                return response;
            }
            List<DeliveryModel> paymentModels = deliveryEntities.getContent().stream().map(DeliveryEntity::toModel).toList();
            response.successResponse(paymentModels, "Get successful");
            response.setPageIndex(pageable.getPageNumber());
            response.setPageSize(pageable.getPageSize());
            response.setTotalCount((int) deliveryEntities.getTotalElements());
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<DeliveryModel> addOrChange(DeliveryModel model) {
        BaseResponseModel<DeliveryModel> response = new BaseResponseModel<>();
        try{
            DeliveryEntity deliveryEntity = new DeliveryEntity();
            String errorMessage = deliveryValidator.validate(model);
            if(StringUtils.hasText(errorMessage)){
                response.errorResponse(errorMessage);
                return response;
            }
            if((model.getId() != null) && (model.getId() > 0)){
                deliveryEntity = deliveryRepository.findById(model.getId()).orElse(null);
                if(deliveryEntity == null){
                    response.errorResponse("Payment not exist to update");
                    return response;
                }
                deliveryEntity.setName(model.getName());
                deliveryEntity.setCode(model.getCode());
                deliveryEntity.setDescription(model.getDescription());
                deliveryEntity.setFee(model.getFee());
            }else{
                deliveryEntity = model.toEntity();
            }

            UserEntity userEntity = authenticationService.authenToken();
            if(userEntity == null){
                response.errorResponse("Authentication failed");
                return response;
            }
            if(Optional.ofNullable(model.getId()).orElse(0) <= 0){
                deliveryEntity.setCreatedBy(userEntity.getId());
                deliveryEntity.setCreatedDate(Date.valueOf(LocalDate.now()));
            }
            deliveryEntity.setUpdatedBy(userEntity.getId());
            deliveryEntity.setUpdatedDate(Date.valueOf(LocalDate.now()));
            DeliveryEntity deliveryEntity1 = deliveryRepository.saveAndFlush(deliveryEntity);
            if(deliveryEntity1.getId() != null){
                if(model.getId() != null){
                    response.successResponse(model, "Update successful");
                }else{
                    response.successResponse(model, "Add successful");
                }
                return response;
            }else{
                if(model.getId() != null){
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
    public BaseResponseModel<DeliveryModel> getById(Integer id) {
        BaseResponseModel<DeliveryModel> response = new BaseResponseModel<>();
        try{
            DeliveryEntity deliveryEntity = deliveryRepository.findById(id).orElse(null);
            if(deliveryEntity == null){
                response.errorResponse("Delivery not exist to update");
                return response;
            }
            DeliveryModel deliveryModel = deliveryEntity.toModel();
            response.successResponse(deliveryModel, "Get successful");
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
            DeliveryEntity deliveryEntity = deliveryRepository.findById(id).orElse(null);
            if(deliveryEntity == null){
                response.errorResponse("Delivery not exist to update");
                return response;
            }
            deliveryRepository.updateDelivery(deliveryEntity.getId(), status);
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
            Integer idLastest =  deliveryRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("DELIVERY", idLastest);
            response.successResponse(codeGender, "Generate delivery code success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
