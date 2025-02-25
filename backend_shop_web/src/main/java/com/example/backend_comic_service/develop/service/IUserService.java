package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.UserModel;
import com.example.backend_comic_service.develop.model.request.LoginRequest;
import com.example.backend_comic_service.develop.model.response.LoginResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

public interface IUserService {
    BaseResponseModel<String> generateCode();
    BaseResponseModel<Integer> addOrChange(UserModel model);
    BaseResponseModel<Integer> deleteUser(Integer id);
    BaseResponseModel<UserModel> getUserDetail(Integer id);
    BaseListResponseModel<List<UserModel>> getListUser(String keySearch, Integer status, Pageable pageable);
    BaseResponseModel<LoginResponse<UserModel>> loginUser(LoginRequest request);
}
