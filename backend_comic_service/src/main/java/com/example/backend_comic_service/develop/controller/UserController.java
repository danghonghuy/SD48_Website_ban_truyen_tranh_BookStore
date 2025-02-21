package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.UserModel;
import com.example.backend_comic_service.develop.model.request.LoginRequest;
import com.example.backend_comic_service.develop.model.response.LoginResponse;
import com.example.backend_comic_service.develop.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/user")
public class UserController {

    @Autowired
    private IUserService userService;

    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode() {
        return userService.generateCode();
    }
    @PostMapping("/register")
    public BaseResponseModel<Integer> register(@RequestBody UserModel model){
        return userService.addOrChange(model);
    }
    @PostMapping("/login")
    public BaseResponseModel<LoginResponse<UserModel>> login(@RequestBody LoginRequest request){
        return userService.loginUser(request);
    }
    @DeleteMapping("/delete/{id}")
    public BaseResponseModel<Integer> delete(@PathVariable Integer id){
        return userService.deleteUser(id);
    }
    @GetMapping("/detail/{id}")
    public BaseResponseModel<UserModel> detail(@PathVariable Integer id){
        return userService.getUserDetail(id);
    }
    @GetMapping("/get-list-user")
    public BaseResponseModel<List<UserModel>> getList(@RequestParam(name = "keySearch", required = false) String keySearch,
                                                      @RequestParam(name = "status", required = false) Integer status,
                                                      @RequestParam(name = "pageIndex", required = true) Integer pageIndex,
                                                      @RequestParam(name = "pageSize", required = true) Integer pageSize){
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        return userService.getListUser(keySearch, status, pageable);
    }
}
