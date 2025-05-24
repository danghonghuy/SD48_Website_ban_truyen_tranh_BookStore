package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.DistrictEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.DistrictModel;
import com.example.backend_comic_service.develop.repository.DistrictRepository;
import com.example.backend_comic_service.develop.service.IDistrictService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DistrictServiceImpl implements IDistrictService {

    @Autowired
    private DistrictRepository districtRepository;

    @Override
    public BaseListResponseModel<DistrictModel> getListDistrict(String name, String provinceCode) {
        BaseListResponseModel<DistrictModel> response = new BaseListResponseModel<>();
        try {
            List<DistrictEntity> districtEntities = districtRepository.getListDistrict(name, provinceCode);

            List<DistrictModel> districtModels = new ArrayList<>();
            int totalElements = 0;

            if (districtEntities != null && !districtEntities.isEmpty()) {
                districtModels = districtEntities.stream()
                        // SỬA Ở ĐÂY: Gọi đúng tên phương thức todistrictModel
                        .map(entity -> entity.todistrictModel())
                        .collect(Collectors.toList());
                totalElements = districtModels.size();
            }

            int currentPageIndex = 1;
            int currentPageSize = totalElements > 0 ? totalElements : 10;

            if (districtModels.isEmpty()) {
                response.successResponse(new ArrayList<>(), 0, "Danh sách quận/huyện trống", currentPageIndex, currentPageSize);
            } else {
                response.successResponse(districtModels, totalElements, "Lấy danh sách quận/huyện thành công", currentPageIndex, currentPageSize);
            }

        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách quận/huyện: {}", e.getMessage(), e);
            response.errorResponse("Lỗi hệ thống khi lấy danh sách quận/huyện: " + e.getMessage(),
                    1,
                    10);
        }
        return response;
    }
}
