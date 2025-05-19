package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.ProductModel;
import com.example.backend_comic_service.develop.model.model.UserChangePassRequest;
import com.example.backend_comic_service.develop.model.model.UserForgetRequest;
import com.example.backend_comic_service.develop.model.model.UserModel;
import com.example.backend_comic_service.develop.model.request.LoginRequest;
import com.example.backend_comic_service.develop.model.response.LoginResponse;
import com.example.backend_comic_service.develop.service.IUserService;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping(value = "/api/user")
public class UserController {

    @Autowired
    private IUserService userService;
    @Autowired
    ObjectMapper objectMapper;

    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode(@RequestParam(name = "prefix") String prefix) {
        return userService.generateCode(prefix);
    }

    @PostMapping("/register")
    public BaseResponseModel<Integer> register(@RequestPart(name = "model") String model, @RequestPart(name = "files", required = false) List<MultipartFile> file) {
        try {
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            byte[] bytes = model.getBytes(StandardCharsets.ISO_8859_1);
            String utf8String = new String(bytes, StandardCharsets.UTF_8);
            UserModel userModel = objectMapper.readValue(utf8String, UserModel.class);
            return userService.addOrChange(userModel, file);
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping("/login")
    public BaseResponseModel<LoginResponse<UserModel>> login(@RequestBody LoginRequest request) {
        return userService.loginUser(request);
    }

    @GetMapping("/delete")
    public BaseResponseModel<Integer> delete(@RequestParam Integer id, @RequestParam Integer status) {
        return userService.deleteUser(id,status);
    }

    @GetMapping("/detail")
    public BaseResponseModel<UserModel> detail(@RequestParam Integer id) {
        return userService.getUserDetail(id);
    }

    @GetMapping("/get-list-user")
    public BaseResponseModel<List<UserModel>> getList(@RequestParam(name = "keySearch", required = false) String keySearch,
                                                      @RequestParam(name = "status", required = false) Integer status,
                                                      @RequestParam(name = "roleId", required = false) Integer roleId,
                                                      @RequestParam(name = "gender", required = false) Boolean gender,
                                                      @RequestParam(name = "pageIndex", required = true) Integer pageIndex,
                                                      @RequestParam(name = "pageSize", required = true) Integer pageSize) {
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize);
        return userService.getListUser(keySearch, status, roleId, gender,  pageable);
    }
    @PostMapping("/create-short-user")
    public BaseResponseModel<UserModel> createUser(@RequestBody UserModel userModel) {
        try {
            return userService.shortCreateCustomer(userModel);
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping("/forget-user")
    public BaseResponseModel<?> forgetUser(@RequestBody UserForgetRequest userForgetRequest) {
        try {
            return userService.forgetUser(userForgetRequest);
        } catch (Exception e) {
            return null;
        }
    }

    @PutMapping("/changePass")
    public BaseResponseModel<?> changePass(@RequestBody UserChangePassRequest userForgetRequest) {
        try {
            return userService.changePass(userForgetRequest);
        } catch (Exception e) {
            return null;
        }
    }
}
