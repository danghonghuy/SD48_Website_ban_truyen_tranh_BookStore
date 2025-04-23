package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.*;
import com.example.backend_comic_service.develop.model.model.AddressModel;
import com.example.backend_comic_service.develop.repository.*;
import com.example.backend_comic_service.develop.service.IAddressService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class AddressServiceImpl implements IAddressService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProvinceRepository provinceRepository;
    @Autowired
    private DistrictRepository districtRepository;
    @Autowired
    private WardRepository wardRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Override
    public void bulkInsertAddress(List<AddressModel> models, UserEntity entity, UserEntity userHandle) {
        try{
            if(!models.isEmpty()){

                List<String> provinceIds = models.stream().map(AddressModel::getProvinceId).toList();
                List<String> districtIds = models.stream().map(AddressModel::getDistrictId).toList();
                List<String> wardIds = models.stream().map(AddressModel::getWardId).toList();

                List<ProvincesEntity> provincesEntities = provinceRepository.getListById(provinceIds);
                List<DistrictEntity> districtEntities = districtRepository.getListById(districtIds);
                List<WardEntity> wardEntities = wardRepository.getListById(wardIds);

                List<AddressEntity> addressEntities = new ArrayList<>();

                models.forEach(item -> {
                    AddressEntity addressEntity = new AddressEntity();
                    addressEntity.setId(item.getId());
                    addressEntity.setAddressDetail(item.getAddressDetail());
                    addressEntity.setCreatedDate(LocalDateTime.now());
                    addressEntity.setCreatedBy(userHandle.getId());
                    addressEntity.setUpdatedDate(LocalDateTime.now());
                    addressEntity.setUpdatedBy(userHandle.getId());
                    addressEntity.setProvince(provincesEntities.stream().filter(e -> Objects.equals(e.getCode(), item.getProvinceId())).findFirst().orElse(null));
                    addressEntity.setDistrict(districtEntities.stream().filter(e -> Objects.equals(e.getCode(), item.getDistrictId())).findFirst().orElse(null));
                    addressEntity.setWard(wardEntities.stream().filter(e -> Objects.equals(e.getCode(), item.getWardId())).findFirst().orElse(null));
                    addressEntity.setStatus(1);
                    addressEntity.setIsDeleted(0);
                    addressEntity.setUserEntity(entity);
                    addressEntity.setIsDefault(item.getIsDefault());
                    addressEntities.add(addressEntity);
                });
                addressRepository.saveAllAndFlush(addressEntities);
            }
        }
        catch (Exception e){
            log.error(e.getMessage());
        }
    }

    @Override
    public void bulkDelete(List<Integer> ids) {
        try{
            addressRepository.bulkDelete(ids);
        }
        catch (Exception e){
            log.error(e.getMessage());
        }
    }
}
