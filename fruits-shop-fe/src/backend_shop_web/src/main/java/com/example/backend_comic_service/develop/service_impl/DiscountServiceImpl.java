package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.DiscountEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.DiscountModel;
import com.example.backend_comic_service.develop.repository.DiscountRepository;
import com.example.backend_comic_service.develop.service.IDiscountService;
import com.example.backend_comic_service.develop.utils.UtilService;
import com.example.backend_comic_service.develop.validator.DiscountValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Date;
import java.util.List;

@Service
public class DiscountServiceImpl implements IDiscountService {

    @Autowired
    private DiscountRepository discountRepository;
    @Autowired
    private DiscountValidator discountValidator;
    @Autowired
    private UtilService utilService;

    @Override
    public BaseResponseModel<DiscountModel> addOrChange(DiscountModel discountModel) {
        BaseResponseModel<DiscountModel> response = new BaseResponseModel<>();
        try{
            String errorMessage = discountValidator.validator(discountModel);
            if(StringUtils.hasText(errorMessage)){
                response.errorResponse(errorMessage);
                return response;
            }
            DiscountEntity discountEntity = discountRepository.saveAndFlush(discountModel.toEntity());

            if(discountEntity.getId() != null){
                response.setData(discountModel);
                response.successResponse(discountModel, "Update successful");
                return response;
            }
            response.errorResponse("Add or change discount failed");
            return response;

        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<DiscountModel> getDiscountById(Integer id) {
        BaseResponseModel<DiscountModel> response = new BaseResponseModel<>();
       try{
           DiscountEntity discountEntity = discountRepository.findById(id).orElse(null);
           if(discountEntity == null){
               response.errorResponse("Discount not found");
               return response;
           }
           DiscountModel discountModel = discountEntity.toDiscountModel();
           response.successResponse(discountModel, "Success");
           return response;
       }
       catch (Exception e){
           response.errorResponse(e.getMessage());
           return response;
       }
    }

    @Override
    public BaseResponseModel<Integer> delete(Integer id) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            DiscountEntity discountEntity = discountRepository.findById(id).orElse(null);
            if(discountEntity == null){
                response.errorResponse("Discount not found");
                return response;
            }
            discountRepository.updateDeleteDiscount(discountEntity.getId());
            response.successResponse(id, "Delete discount success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
    @Override
    public BaseListResponseModel<List<DiscountModel>> getListDiscount(Date startDate, Date endDate, Integer minValue, Integer maxValue, String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<List<DiscountModel>> response = new BaseListResponseModel<>();
        try{
            Page<DiscountEntity> entityList = discountRepository.getListDiscount(startDate, endDate, minValue, maxValue, keySearch, status, pageable);
            if(entityList == null){
                response.errorResponse("Discount list is empty");
                return response;
            }
            List<DiscountModel> discountModels = entityList.getContent().stream().map(DiscountEntity::toDiscountModel).toList();
            response.successResponse(discountModels, "Success");
            response.setTotalCount((int) entityList.getTotalElements());
            response.setPageSize(pageable.getPageSize());
            response.setPageIndex(pageable.getPageNumber());
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
    @Override
    public BaseResponseModel<String> generateDiscountCode() {
        BaseResponseModel<String> response  = new BaseResponseModel<>();
        try{
            Integer idLastest =  discountRepository.getIdGenerateCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("DIS", idLastest);
            response.successResponse(codeGender, "Generate discount code success");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
