package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.configs.configs_sercurity_service.JwtService;
import com.example.backend_comic_service.develop.entity.AddressEntity;
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.entity.RoleEntity;
import com.example.backend_comic_service.develop.exception.ServiceException;
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.*;
import com.example.backend_comic_service.develop.model.request.LoginRequest;
import com.example.backend_comic_service.develop.model.response.LoginResponse;
import com.example.backend_comic_service.develop.repository.AddressRepository;
import com.example.backend_comic_service.develop.repository.RoleRepository;
import com.example.backend_comic_service.develop.repository.UserRepository;
import com.example.backend_comic_service.develop.service.IAddressService;
import com.example.backend_comic_service.develop.service.IDistrictService;
import com.example.backend_comic_service.develop.service.IProductService;
import com.example.backend_comic_service.develop.service.IUserService;
import com.example.backend_comic_service.develop.utils.*;
import com.example.backend_comic_service.develop.validator.UserValidator;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
@Slf4j
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
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private IAddressService addressService;
    @Autowired
    private HandleImageService handleImageService;
    @Autowired
    private HandleMailService handleMailService;
    @Autowired
    private AddressRepository addressRepository;

    @Override
    public BaseResponseModel<String> generateCode(String prefix) {
        BaseResponseModel<String> response = new BaseResponseModel<>();
        try {
            Integer idLastest = userRepository.generateUserCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode(prefix, idLastest);
            response.successResponse(codeGender, "Tạo mã người dùng thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<Integer> addOrChange(UserModel model, List<MultipartFile> files) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        String password = "123456";
        try {
            String errorString = userValidator.validateUser(model);
            if (StringUtils.hasText(errorString)) {
                response.errorResponse(errorString);
                return response;
            }
            RoleEntity roleEntity = roleRepository.findRoleEntitiesById(Long.valueOf(model.getRoleId())).orElse(null);
            if (roleEntity == null) {
                response.errorResponse("Id vai trò không tồn tại");
                return response;
            }
            UserEntity entity = userRepository.findByUserName(model.getUserName()).stream().findFirst().orElse(null);
            if (entity != null && model.getId() == null) {
                response.errorResponse("Tài khoản đã tồn tại");
                return response;
            }
            entity = model.toUserEntity();
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                UserEntity userCreate = userRepository.findUserEntitiesByUserNameAndStatus(username, 1).orElse(null);
                if (userCreate == null && (roleEntity.getCode().equals("EMPLOYEE") || roleEntity.getCode().equals("ADMIN"))) {
                    response.errorResponse("Token người dùng không hợp lệ");
                    return response;
                } else if (userCreate != null) {
                    entity.setCreatedBy(userCreate.getId());
                    entity.setUpdatedBy(userCreate.getId());
                }
                if (Optional.ofNullable(model.getId()).orElse(0) == 0) {
                    entity.setCreatedDate(LocalDateTime.now());
                } else {
                    entity = userRepository.findUserEntitiesById(model.getId()).orElse(null);
                    if (entity == null) {
                        response.errorResponse("Thông tin cập nhật người dùng không hợp lệ");
                        return response;
                    }
                    entity.setEmail(model.getEmail());
                    entity.setFullName(model.getFullName());
                    entity.setPhoneNumber(model.getPhoneNumber());
                    entity.setGender(model.isGender());
                    entity.setDateBirth(model.getDateBirth() != null ? model.getDateBirth().toLocalDate(): null);
                    entity.setDescription(model.getDescription());
                    entity.setStatus(model.getStatus());
                }
                entity.setUpdatedDate(LocalDateTime.now());
            } catch (Exception e) {
                log.error(e.getMessage());
                response.errorResponse(e.getMessage());
                return response;
            }
            if (model.getId() == null) {
                if (model.getRoleId() == 6) {
                    String passwordHash = hashService.md5Hash(password);
                    entity.setPassword(passwordHash);
                } else {
                    password = utilService.generatePassword();
                    String passwordHash = hashService.md5Hash(password);
                    entity.setPassword(passwordHash);
                }
            }
            if (model.getPassword() != null) {
                password = model.getPassword();
                String passwordHash = hashService.md5Hash(password);
                entity.setPassword(passwordHash);
                entity.setStatus(1);
            }

            entity.setRoleEntity(roleEntity);
            if (files != null && !files.isEmpty()) {
                String imageUrl = handleImageService.saveFileImage(files.get(0));
                entity.setImageUrl(imageUrl);
            }
            UserEntity userSave = userRepository.saveAndFlush(entity);
            if (userSave.getId() != null) {
//                if (model.getId() == null) {
//                    this.sendMail(entity, password);
//                }
                if (model.getAddress() != null) {
                    addressService.bulkInsertAddress(model.getAddress().stream().filter(item -> item.getStage() == 1).toList(), userSave, entity, 0, null);
                    List<Integer> addressModelDel = model.getAddress().stream().filter(item -> item.getStage() <= 0 && item.getId() != null).toList().stream().map(AddressModel::getId).toList();
                    if (!addressModelDel.isEmpty()) {
                        addressService.bulkDelete(addressModelDel);
                    }
                }

                response.successResponse(userSave.getId(), "Người dùng đã được thêm thành công");
                return response;
            }
            response.errorResponse("Thêm người dùng thất bại");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    private void sendMail(UserEntity entity, String pwd) {
        SendMailModel sendMailModel = new SendMailModel();
        sendMailModel.setPassword(pwd);
        sendMailModel.setToMail(entity.getEmail());
        sendMailModel.setSubject("Đăng nhập xác thực");
        sendMailModel.setFullName(entity.getFullName());
        sendMailModel.setUserName(entity.getUsername());
        handleMailService.sendMailMime(sendMailModel);
    }

    @Override
    public BaseResponseModel<Integer> deleteUser(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            UserEntity user = userRepository.findUserEntitiesById(id).orElse(null);
            if (user == null) {
                response.errorResponse("ID người dùng không tồn tại");
                return response;
            }
            user.setStatus(status);
            user.setIsDeleted(1);
            UserEntity userEntity = userRepository.saveAndFlush(user);
            if (userEntity.getId() != null) {
                response.successResponse(id, "Người dùng đã được xóa thành công");
                return response;
            }
            response.errorResponse("Xóa người dùng thất bại");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<UserModel> getUserDetail(Integer id) {
        BaseResponseModel<UserModel> response = new BaseResponseModel<>();
        try {
            UserEntity user = userRepository.findUserEntitiesById(id).orElse(null);
            if (user == null) {
                response.errorResponse("ID người dùng không tồn tại");
                return response;
            }
            UserModel userModel = user.toUserModel();
            response.setData(userModel);
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseListResponseModel<List<UserModel>> getListUser(String keySearch, Integer status, Integer roleId, Boolean gender, Pageable pageable) {
        BaseListResponseModel<List<UserModel>> response = new BaseListResponseModel<>();
        try {

            Page<UserEntity> userEntities = userRepository.getListUser(keySearch, status, List.of(roleId), gender, pageable);
            if (userEntities == null) {
                response.successResponse(null, "Danh sách người dùng trống");
                return response;
            }

            List<UserModel> userModels = userEntities.get().toList().stream().map(UserEntity::toUserModel).toList();
            response.setData(userModels);
            response.setPageIndex(pageable.getPageNumber());
            response.setPageSize(pageable.getPageSize());
            response.setTotalCount((int) userEntities.getTotalElements());
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<LoginResponse<UserModel>> loginUser(LoginRequest request) {
        BaseResponseModel<LoginResponse<UserModel>> response = new BaseResponseModel<>();
        try {
            UserEntity userEntity = userRepository.findUserEntitiesByUserNameAndStatus(request.getUserName(), 1).orElse(null);
            if (userEntity == null) {
                response.errorResponse("Tên người dùng không tồn tại");
                return response;
            }
            String passwordHash = hashService.md5Hash(request.getPassword());
            if (!userEntity.getPassword().equals(passwordHash)) {
                throw new ServiceException(ErrorCodeConst.UNAUTHORIZED, null);
//                return response;
            }
            UserModel userModel = userEntity.toUserModel();
            String token = jwtService.generateToken(userEntity);
            LoginResponse<UserModel> loginResponse = new LoginResponse<>();
            loginResponse.setToken(token);
            loginResponse.setTokeType("Bearer");
            loginResponse.setExpiresIn(60L);
            loginResponse.setData(userModel);
            response.successResponse(loginResponse, "Đăng nhập thành công");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<UserModel> shortCreateCustomer(UserModel model) {
        BaseResponseModel<UserModel> response = new BaseResponseModel<>();
        try {
            String errorString = userValidator.validateUser(model);
            if (StringUtils.hasText(errorString)) {
                response.errorResponse(errorString);
                return response;
            }
            RoleEntity roleEntity = roleRepository.findRoleEntitiesById(5L).orElse(null);
            if (roleEntity == null) {
                response.errorResponse("ID vai trò không tồn tại");
                return response;
            }
            UserEntity entity = model.toUserEntity();
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                UserEntity userCreate = userRepository.findUserEntitiesByUserNameAndStatus(username, 1).orElse(null);
                if (userCreate == null) {
                    response.errorResponse("Token người dùng không hợp lệ");
                    return response;
                }
                if (Optional.ofNullable(model.getId()).orElse(0) == 0) {
                    entity.setCreatedBy(userCreate.getId());
                    entity.setCreatedDate(LocalDateTime.now());
                } else {
                    entity = userRepository.findUserEntitiesById(model.getId()).orElse(null);
                    if (entity == null) {
                        response.errorResponse("Thông tin cập nhật người dùng không hợp lệ");
                        return response;
                    }
                    entity.setEmail(model.getEmail());
                    entity.setFullName(model.getFullName());
                    entity.setPhoneNumber(model.getPhoneNumber());
                    entity.setGender(model.isGender());
                    entity.setDateBirth(model.getDateBirth() != null ? model.getDateBirth().toLocalDate() : null);
                }
                entity.setUpdatedBy(userCreate.getId());
                entity.setUpdatedDate(LocalDateTime.now());
            } catch (Exception e) {
                log.error(e.getMessage());
                response.errorResponse(e.getMessage());
                return response;
            }
            String password = utilService.generatePassword();
            String passwordHash = hashService.md5Hash(password);
            entity.setPassword(passwordHash);
            entity.setRoleEntity(roleEntity);

            UserEntity userSave = userRepository.saveAndFlush(entity);
            if (userSave.getId() != null) {
                addressService.bulkInsertAddress(model.getAddress().stream().filter(item -> item.getStage() == 1).toList(), userSave, entity, 0, null);

                List<Integer> addressModelDel = model.getAddress().stream().filter(item -> item.getStage() <= 0 && item.getId() != null).toList().stream().map(AddressModel::getId).toList();
                if (!addressModelDel.isEmpty()) {
                    addressService.bulkDelete(addressModelDel);
                }
                Executors.newSingleThreadScheduledExecutor().execute(() -> {
                    SendMailModel sendMailModel = new SendMailModel();
                    sendMailModel.setPassword(password);
                    sendMailModel.setToMail(userSave.getEmail());
                    sendMailModel.setSubject("Đăng nhập xác thực");
                    sendMailModel.setFullName(userSave.getFullName());
                    sendMailModel.setUserName(userSave.getUsername());
                    handleMailService.sendMailMime(sendMailModel);
                });

                UserEntity userEntity = userRepository.findUserEntitiesById(userSave.getId()).orElse(null);
                assert userEntity != null;
                Set<AddressEntity> addressEntities = addressRepository.getByUserId(userEntity.getId());
                userEntity.setAddressEntities(addressEntities);
                response.successResponse(userEntity.toUserModel(), "Tạo người dùng thành công");
                return response;
            }
            response.errorResponse("Tạo người dùng thất bại");
            return response;
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
            return response;
        }
    }

    @Override
    public BaseResponseModel<?> forgetUser(UserForgetRequest request) {
        BaseResponseModel<UserModel> response = new BaseResponseModel<>();

        UserEntity user = userRepository.findByUserNameAndEmail(request.getUserName(), request.getEmail());
        if (user == null) {
            response.errorResponse("Not found info");
            return response;
        }
        String password = utilService.generatePassword();
        String passwordHash = hashService.md5Hash(password);
        user.setPassword(passwordHash);
        userRepository.save(user);
        this.sendMail(user, password);
        return null;
    }

    @Override
    public BaseResponseModel<?> changePass(UserChangePassRequest userForgetRequest) {
        BaseResponseModel<UserModel> response = new BaseResponseModel<>();
        String passwordNew = userForgetRequest.getNewPassword();
        String passwordOld = userForgetRequest.getPassword();

        UserEntity user = userRepository.findByUserName(userForgetRequest.getUsername()).stream().findFirst().orElse(null);
        if (user == null) {
            response.errorResponse("Not found info");
            return response;
        }

        if (!user.getPassword().equals(hashService.md5Hash(passwordOld))) {
            response.errorResponse("password old not exist!");
            return response;
        }

        String passwordHashNew = hashService.md5Hash(passwordNew);
        user.setPassword(passwordHashNew);
        userRepository.save(user);
        return null;
    }
}
