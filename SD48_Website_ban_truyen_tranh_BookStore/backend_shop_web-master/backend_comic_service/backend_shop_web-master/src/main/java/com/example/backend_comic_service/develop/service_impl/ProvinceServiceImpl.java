package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.ProvincesEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.ProvinceModel;
import com.example.backend_comic_service.develop.repository.ProvinceRepository;
import com.example.backend_comic_service.develop.service.IProvinceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProvinceServiceImpl implements IProvinceService {

    @Autowired
    private ProvinceRepository provinceRepository;

    @Override
    public BaseListResponseModel<ProvinceModel> getListProvinces(String name) {
        BaseListResponseModel<ProvinceModel> response = new BaseListResponseModel<>();
        try {
            List<ProvincesEntity> provincesEntities = provinceRepository.getListProvinces(name);

            List<ProvinceModel> provinceModels = new ArrayList<>();
            int totalElements = 0;

            if (provincesEntities != null && !provincesEntities.isEmpty()) {
                provinceModels = provincesEntities.stream()
                        .map(ProvincesEntity::toProvinceModel) // Giả sử ProvincesEntity có toProvinceModel()
                        .collect(Collectors.toList());
                totalElements = provinceModels.size();
            }

            // Vì đây không phải là danh sách phân trang từ Pageable,
            // chúng ta sẽ set các giá trị phân trang mặc định hoặc dựa trên kích thước của list.
            int currentPageIndex = 1; // Mặc định trang 1
            // pageSize có thể là tổng số phần tử nếu trả về tất cả, hoặc một giá trị mặc định
            int currentPageSize = totalElements > 0 ? totalElements : 10; // Ví dụ: 10 nếu danh sách rỗng

            if (provinceModels.isEmpty()) {
                response.successResponse(new ArrayList<>(), 0, "Danh sách tỉnh/thành phố trống", currentPageIndex, currentPageSize);
            } else {
                response.successResponse(provinceModels, totalElements, "Lấy danh sách tỉnh/thành phố thành công", currentPageIndex, currentPageSize);
            }

        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách tỉnh/thành phố: {}", e.getMessage(), e);
            // Cung cấp giá trị mặc định cho pageIndex và pageSize khi lỗi
            response.errorResponse("Lỗi hệ thống khi lấy danh sách tỉnh/thành phố: " + e.getMessage(), 1, 10);
        }
        return response;
    }
}
