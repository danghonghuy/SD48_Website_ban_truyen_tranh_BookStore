package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.exception.ServiceException;
import com.example.backend_comic_service.develop.utils.AuthenticationService;
import com.example.backend_comic_service.develop.utils.ErrorCodeConst;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public abstract class GenerateService {

    @Autowired
    private AuthenticationService authenticationService;

    public UserEntity getUserEntity() {
        UserEntity userEntity = authenticationService.authenToken();
        if(userEntity == null) {
            throw new ServiceException(ErrorCodeConst.NOT_FOUND_INFO, null);
        }
        return userEntity;
    }
}
