package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.WardEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.WardModel;
import com.example.backend_comic_service.develop.repository.WardRepository;
import com.example.backend_comic_service.develop.service.IWardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class WardServiceImpl implements IWardService {
    @Autowired
    private WardRepository wardRepository;

    @Override
    public BaseListResponseModel<WardModel> getListWards(String name, String districtCode) {
        BaseListResponseModel<WardModel> response = new BaseListResponseModel<>();
        try {
            log.info("Đang lấy danh sách xã/phường với name: '{}', districtCode: '{}'", name, districtCode);
            List<WardEntity> wardEntities = wardRepository.getListWards(name, districtCode);

            List<WardModel> wardModels = new ArrayList<>();
            int totalElements = 0;

            if (wardEntities != null && !wardEntities.isEmpty()) {
                wardModels = wardEntities.stream()
                        .map(WardEntity::toWardModel) // Giả sử WardEntity có toWardModel()
                        .collect(Collectors.toList());
                totalElements = wardModels.size();
            }

            // Vì đây không phải là danh sách phân trang từ Pageable,
            // chúng ta sẽ set các giá trị phân trang mặc định hoặc dựa trên kích thước của list.
            int currentPageIndex = 1; // Mặc định trang 1
            int currentPageSize = totalElements > 0 ? totalElements : 10; // Mặc định pageSize là 10 hoặc bằng totalElements nếu có

            if (wardModels.isEmpty()) {
                response.successResponse(new ArrayList<>(), 0, "Danh sách xã/phường trống", currentPageIndex, currentPageSize);
            } else {
                // Message có thể là "Lấy danh sách xã/phường thành công" thay vì size
                response.successResponse(wardModels, totalElements, "Lấy danh sách xã/phường thành công", currentPageIndex, currentPageSize);
            }

        } catch (Exception e) {
            // log.error("Lỗi khi lấy danh sách xã/phường: {}", e.getMessage(), e); // Nên có log
            response.errorResponse("Lỗi hệ thống khi lấy danh sách xã/phường: " + e.getMessage(),
                    1, // pageIndex mặc định khi lỗi
                    10); // pageSize mặc định khi lỗi, hoặc một giá trị khác
        }
        return response;
    }
}
