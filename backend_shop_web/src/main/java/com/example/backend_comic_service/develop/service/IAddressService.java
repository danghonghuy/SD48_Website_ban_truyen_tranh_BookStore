package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.model.AddressModel;

import java.util.List;

public interface IAddressService {
    void bulkInsertAddress(List<AddressModel> models, UserEntity entity, UserEntity userHandle);
    void bulkDelete(List<Integer> ids);
}
