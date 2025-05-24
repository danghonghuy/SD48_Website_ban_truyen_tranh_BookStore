package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.entity.OrderEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.model.AddressModel;

import java.util.List;

public interface IAddressService {
    void bulkInsertAddress(List<AddressModel> models, UserEntity entity, UserEntity userHandle, Integer isChangeOrder, OrderEntity orderEntity);
    void bulkDelete(List<Integer> ids);
    void processUserAddresses(UserEntity user, List<AddressModel> requestedAddresses);

}
