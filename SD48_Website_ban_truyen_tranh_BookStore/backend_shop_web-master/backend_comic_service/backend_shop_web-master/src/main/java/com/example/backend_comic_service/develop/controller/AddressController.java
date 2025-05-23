package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.CategoryModel;
import com.example.backend_comic_service.develop.model.model.DistrictModel;
import com.example.backend_comic_service.develop.model.model.ProvinceModel;
import com.example.backend_comic_service.develop.model.model.WardModel;
import com.example.backend_comic_service.develop.service.IDistrictService;
import com.example.backend_comic_service.develop.service.IProvinceService;
import com.example.backend_comic_service.develop.service.IWardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    @Autowired
    private IProvinceService provinceService;
    @Autowired
    private IDistrictService districtService;
    @Autowired
    private IWardService wardService;

    @GetMapping("/get-province")
    public BaseListResponseModel<ProvinceModel> getListProvince( // Sửa ở đây
                                                                 @RequestParam(value = "name", required = false) String name) {
        return provinceService.getListProvinces(name);
    }
    @GetMapping("/get-district")
    public BaseListResponseModel<DistrictModel> getListDistrict( // Sửa ở đây
                                                                 @RequestParam(value = "name", required = false) String name,
                                                                 @RequestParam(value = "code", required = false) String code) {
        // Giả sử service không cần Pageable cho API này
        return districtService.getListDistrict(name, code);
    }
    @GetMapping("/get-wards")
    public BaseListResponseModel<WardModel> getListWard( // Sửa ở đây
                                                         @RequestParam(value = "name", required = false) String name,
                                                         @RequestParam(value = "districtCode", required = false) String districtCode) { // Đổi tên tham số cho khớp với service
        // Giả sử service không cần Pageable cho API này
        return wardService.getListWards(name, districtCode);
    }
}
