package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.UserChangePassRequest;
import com.example.backend_comic_service.develop.model.model.UserForgetRequest;
import com.example.backend_comic_service.develop.model.model.UserModel;
import com.example.backend_comic_service.develop.model.request.LoginRequest;
import com.example.backend_comic_service.develop.model.response.LoginResponse;
import org.springframework.data.domain.Pageable;
// Bỏ @Component vì đây là interface, không phải là một Spring bean cụ thể
// import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IUserService {
    BaseResponseModel<String> generateCode(String prefix);

    // ĐÃ BỎ: BaseResponseModel<Integer> addOrChange(UserModel model, List<MultipartFile> file);

    // THÊM PHƯƠNG THỨC MỚI CHO TẠO USER
    BaseResponseModel<Integer> createNewUser(UserModel userModelRequest, List<MultipartFile> files);

    // THÊM PHƯƠNG THỨC MỚI CHO CẬP NHẬT USER PROFILE
    BaseResponseModel<Integer> updateUserProfile(UserModel userModelRequest, List<MultipartFile> files);

    BaseResponseModel<Integer> deleteUser(Integer id, Integer status);

    BaseResponseModel<UserModel> getUserDetail(Integer id);

    BaseListResponseModel<UserModel> getListUser(
            String keySearch, Integer status, Integer roleId, Boolean gender, Pageable pageable
    );
    BaseResponseModel<LoginResponse<UserModel>> loginUser(LoginRequest request);

    BaseResponseModel<UserModel> shortCreateCustomer(UserModel model); // Xem xét có cần List<MultipartFile> files ở đây không

    BaseResponseModel<?> forgetUser(UserForgetRequest userForgetRequest);

    BaseResponseModel<?> changePass(UserChangePassRequest userForgetRequest);
}