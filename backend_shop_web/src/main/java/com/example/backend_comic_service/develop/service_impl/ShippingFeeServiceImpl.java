package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.ShippingFee;
import com.example.backend_comic_service.develop.enums.StatusFeeEnum;
import com.example.backend_comic_service.develop.exception.ServiceException;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.dto.ShippingFeeDTO;
import com.example.backend_comic_service.develop.model.request.shipping_fee.ShippingFeeUpdate;
import com.example.backend_comic_service.develop.utils.ErrorCodeConst;
import com.example.backend_comic_service.develop.model.request.shipping_fee.ShippingFeeModel;
import com.example.backend_comic_service.develop.repository.ShippingFeeRepository;
import com.example.backend_comic_service.develop.service.ShippingFeeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class ShippingFeeServiceImpl extends GenerateService implements ShippingFeeService {

    private final ShippingFeeRepository shippingFeeRepository;

    @Override
    @Transactional(rollbackOn = Exception.class)
    public ShippingFeeDTO create(ShippingFeeModel model) {
        if (shippingFeeRepository.existsByPointDestinationAndPointSource(model.getPointDestination(), model.getPointSource()))
            throw new ServiceException(ErrorCodeConst.FEE_IS_EXIST, null);

        ShippingFee shippingFee = model.toEntity();
        shippingFee.setCreatedDate(LocalDateTime.now());
        shippingFee.setCreatedBy(getUserEntity().getUsername());
        shippingFeeRepository.save(shippingFee);
        return shippingFee.toDTO();
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public ShippingFeeDTO update(Long feeId, ShippingFeeUpdate request) throws Exception {
        ShippingFee shippingFee = shippingFeeRepository.findById(feeId)
                .orElseThrow(() -> new ServiceException(ErrorCodeConst.NOT_FOUND_POINT, null));

        if (!shippingFee.getPointDestination().equals(request.getPointDestination())) {
            if (shippingFeeRepository.existsByPointDestination(request.getPointDestination())) {
                throw new ServiceException(ErrorCodeConst.POINT_DESTINATION_IS_EXIST, null);
            }
        }

        if (!shippingFee.getPointSource().equals(request.getPointSource())) {
            if (shippingFeeRepository.existsByPointSource(request.getPointSource())) {
                throw new ServiceException(ErrorCodeConst.POINT_SOURCE_IS_EXIST, null);
            }
        }
        request.updateShippingFee(request, shippingFee);
        shippingFee.setUpdatedDate(LocalDateTime.now());
        shippingFee.setUpdatedBy(getUserEntity().getUsername());
        shippingFeeRepository.save(shippingFee);

        return shippingFee.toDTO();
    }

    @Override
    public ShippingFeeDTO detail(Long feeId) {
        ShippingFee shippingFee = shippingFeeRepository.findById(feeId)
                .orElseThrow(() -> new ServiceException(ErrorCodeConst.NOT_FOUND_POINT, null));
        return shippingFee.toDTO();
    }

    @Override
    public BaseListResponseModel<List<ShippingFeeDTO>> getPage(String keySearch, StatusFeeEnum status, Pageable pageable) {
        BaseListResponseModel<List<ShippingFeeDTO>> response = new BaseListResponseModel<>();

        Page<ShippingFee> shippingFee = shippingFeeRepository.getListShippingFee(keySearch, status, pageable);
        List<ShippingFeeDTO> feeDTOS = shippingFee.stream().map(fee -> fee.toDTO()).toList();
        response.successResponse(feeDTOS, "Success");
        response.setTotalCount(feeDTOS.size());
        response.setPageIndex(pageable.getPageNumber());
        response.setPageSize(pageable.getPageSize());
        return response;
    }

    @Override
    public Double getFee(String pointSource, String pointDestination) {
        ShippingFee shippingFee = shippingFeeRepository.findByPointSourceAndPointDestinationAndStatus(pointSource, pointDestination, StatusFeeEnum.ACTIVE);
        if (shippingFee == null)
            throw new ServiceException(ErrorCodeConst.NOT_FOUND_FEE, null);

        return shippingFee.getFee();
    }
}
