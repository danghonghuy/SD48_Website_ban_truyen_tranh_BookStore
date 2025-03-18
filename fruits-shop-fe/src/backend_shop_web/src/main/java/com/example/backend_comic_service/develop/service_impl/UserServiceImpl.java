package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.configs.configs_sercurity_service.JwtService;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.entity.RoleEntity;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.request.LoginRequest;
import com.example.backend_comic_service.develop.model.response.LoginResponse;
import com.example.backend_comic_service.develop.repository.RoleRepository;
import com.example.backend_comic_service.develop.repository.UserRepository;
import com.example.backend_comic_service.develop.service.IUserService;
import com.example.backend_comic_service.develop.utils.HashService;
import com.example.backend_comic_service.develop.validator.UserValidator;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.UserModel;
import com.example.backend_comic_service.develop.utils.UtilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UtilService utilService;
    @Autowired
    private UserValidator userValidator;
    @Autowired
    private HashService hashService;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private AuthenticationManager  authenticationManager;
    @Autowired
    private JwtService jwtService;


    @Override
    public BaseResponseModel<String> generateCode() {
        BaseResponseModel<String> response = new BaseResponseModel<>();
        try{
            Integer idLastest =  userRepository.generateUserCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode("USR", idLastest);
            response.successResponse(codeGender, "Generate user code success");
            return response;
        }
        catch(Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> addOrChange(UserModel model) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            String errorString = userValidator.validateUser(model);
            if(StringUtils.hasText(errorString)){
                response.errorResponse(errorString);
                return response;
            }

            RoleEntity roleEntity = roleRepository.findRoleEntitiesById(Long.valueOf(model.getRoleId())).orElse(null);
            if(roleEntity == null){
                response.errorResponse("Role id not exist");
                return response;
            }

            UserEntity entity = model.toUserEntity();
            String passwordHash = hashService.md5Hash(model.getPassword());
            entity.setPassword(passwordHash);
            entity.setRoleEntity(roleEntity);

            UserEntity roleSave = userRepository.saveAndFlush(entity);
            if(roleSave.getId() != null){
                response.successResponse(roleSave.getId(), "User added successfully");
                return response;
            }
            response.errorResponse("User add failed");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> deleteUser(Integer id) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try{
            UserEntity user = userRepository.findUserEntitiesById(id).orElse(null);
            if(user == null){
                response.errorResponse("User id not exist");
                return response;
            }
            user.setStatus(0);
            user.setIsDeleted(1);
            UserEntity userEntity =  userRepository.saveAndFlush(user);
            if(userEntity.getId() != null){
                response.successResponse(id, "User deleted successfully");
                return response;
            }
            response.errorResponse("User deleted fail");
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<UserModel> getUserDetail(Integer id) {
        BaseResponseModel<UserModel> response = new BaseResponseModel<>();
        try{
            UserEntity user = userRepository.findUserEntitiesById(id).orElse(null);
            if(user == null){
                response.errorResponse("User id not exist");
                return response;
            }
            UserModel userModel = user.toUserModel();
            response.setData(userModel);
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<List<UserModel>> getListUser(String keySearch, Integer status, Pageable pageable) {
        BaseListResponseModel<List<UserModel>> response = new BaseListResponseModel<>();
        try{

            Page<UserEntity> userEntities = userRepository.getListUser(keySearch, status, pageable);
            if(userEntities == null){
                response.successResponse(null, "List is empty");
                return response;
            }

            List<UserModel> userModels = userEntities.get().toList().stream().map(UserEntity::toUserModel).toList();
            response.setData(userModels);
            response.setPageIndex(pageable.getPageNumber());
            response.setPageSize(pageable.getPageSize());
            response.setTotalCount((int) userEntities.getTotalElements());
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<LoginResponse<UserModel>> loginUser(LoginRequest request) {
        BaseResponseModel<LoginResponse<UserModel>> response = new BaseResponseModel<>();
        try{
            UserEntity userEntity =  userRepository.findUserEntitiesByUserName(request.getUserName()).orElse(null);
            if(userEntity == null){
                response.errorResponse("User name not exist");
                return response;
            }
            String passwordHash = hashService.md5Hash(request.getPassword());
            if(!userEntity.getPassword().equals(passwordHash)){
                response.errorResponse("Password is not correct");
                return response;
            }
            UserModel userModel = userEntity.toUserModel();
            String token = jwtService.generateToken(userEntity);
            LoginResponse<UserModel> loginResponse = new LoginResponse<>();
            loginResponse.setToken(token);
            loginResponse.setTokeType("Bearer");
            loginResponse.setExpiresIn(60L);
            loginResponse.setData(userModel);
            response.setData(loginResponse);
            return response;
        }
        catch (Exception e){
            response.errorResponse(e.getMessage());
            return response;
        }
    }
}
