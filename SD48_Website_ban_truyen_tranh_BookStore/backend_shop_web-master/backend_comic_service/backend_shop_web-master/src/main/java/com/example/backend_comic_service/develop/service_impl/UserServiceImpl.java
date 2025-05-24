package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.configs.configs_sercurity_service.JwtService;
// import com.example.backend_comic_service.develop.entity.AddressEntity; // Không dùng trực tiếp
import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.entity.RoleEntity;
// import com.example.backend_comic_service.develop.exception.ServiceException; // Không thấy dùng trực tiếp
import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel;
import com.example.backend_comic_service.develop.model.model.*;
import com.example.backend_comic_service.develop.model.request.LoginRequest;
import com.example.backend_comic_service.develop.model.response.LoginResponse;
// import com.example.backend_comic_service.develop.repository.AddressRepository; // Không dùng trực tiếp
import com.example.backend_comic_service.develop.repository.RoleRepository;
import com.example.backend_comic_service.develop.repository.UserRepository;
import com.example.backend_comic_service.develop.service.IAddressService;
import com.example.backend_comic_service.develop.service.IUserService;
import com.example.backend_comic_service.develop.utils.*;
import com.example.backend_comic_service.develop.validator.UserValidator;
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
// import java.util.Set; // Không thấy dùng
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
    private JwtService jwtService;
    @Autowired
    private IAddressService addressService;
    @Autowired
    private HandleImageService handleImageService;
    @Autowired
    private HandleMailService handleMailService;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public BaseResponseModel<String> generateCode(String prefix) {
        BaseResponseModel<String> response = new BaseResponseModel<>();
        try {
            Integer idLastest = userRepository.generateUserCode();
            idLastest = idLastest == null ? 1 : (idLastest + 1);
            String codeGender = utilService.getGenderCode(prefix, idLastest);
            response.successResponse(codeGender, "Tạo mã người dùng thành công");
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public BaseResponseModel<Integer> createNewUser(UserModel userModelRequest, List<MultipartFile> files) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        log.info("Attempting to create new user with username: {}", userModelRequest.getUserName());
        String generatedPassword = null;
        UserEntity userPerformingAction = null;

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
                userPerformingAction = userRepository.findUserEntitiesByUserNameAndStatus(authentication.getName(), 1).orElse(null);
            }
            Integer userPerformingActionId = (userPerformingAction != null) ? userPerformingAction.getId() : null;

            String errorString = userValidator.validateUser(userModelRequest);
            if (StringUtils.hasText(errorString)) {
                response.errorResponse(errorString);
                return response;
            }
            if (userRepository.findByUserName(userModelRequest.getUserName()).isPresent()) {
                response.errorResponse("Tên đăng nhập '" + userModelRequest.getUserName() + "' đã tồn tại.");
                return response;
            }
            if (userModelRequest.getFullName() == null || userModelRequest.getFullName().trim().isEmpty()) {
                response.errorResponse("Họ và tên không được để trống khi tạo người dùng mới.");
                return response;
            }
            if (userModelRequest.getRoleId() == null) {
                response.errorResponse("ID vai trò không được để trống khi tạo người dùng mới.");
                return response;
            }

            RoleEntity roleEntity = roleRepository.findRoleEntitiesById(userModelRequest.getRoleId().longValue())
                    .orElse(null);
            if (roleEntity == null) {
                response.errorResponse("Vai trò không hợp lệ hoặc không tồn tại với ID: " + userModelRequest.getRoleId());
                return response;
            }

            UserEntity entityToSave = modelMapper.map(userModelRequest, UserEntity.class);
            entityToSave.setId(null);
            entityToSave.setCreatedDate(LocalDateTime.now());
            entityToSave.setUpdatedDate(LocalDateTime.now());
            entityToSave.setRoleEntity(roleEntity);
            entityToSave.setStatus(Optional.ofNullable(userModelRequest.getStatus()).orElse(1));
            entityToSave.setIsDeleted(0);

            if (userPerformingActionId != null) {
                entityToSave.setCreatedBy(userPerformingActionId);
                entityToSave.setUpdatedBy(userPerformingActionId);
            }

            generatedPassword = utilService.generatePassword();
            entityToSave.setPassword(hashService.md5Hash(generatedPassword));

            if (files != null && !files.isEmpty()) {
                try {
                    String imageUrl = handleImageService.saveFileImage(files.get(0));
                    entityToSave.setImageUrl(imageUrl);
                } catch (Exception e) {
                    log.error("Error saving image file for new user: {}", e.getMessage());
                }
            }

            UserEntity savedUser;
            try {
                savedUser = userRepository.saveAndFlush(entityToSave);
            } catch (DataIntegrityViolationException e) {
                log.error("DataIntegrityViolationException while creating user: {}", e.getMessage(), e);
                String specificMessage = "Lỗi ràng buộc dữ liệu. ";
                if (e.getMessage() != null) {
                    if (e.getMessage().toLowerCase().contains("fullname") || e.getMessage().toLowerCase().contains("full_name")) {
                        specificMessage = "Họ và tên không được để trống hoặc đã vi phạm ràng buộc.";
                    } else if (e.getMessage().toLowerCase().contains("username") || e.getMessage().toLowerCase().contains("user_name")) {
                        specificMessage = "Tên đăng nhập đã tồn tại hoặc không hợp lệ.";
                    } else if (e.getMessage().toLowerCase().contains("email")) {
                        specificMessage = "Email đã tồn tại hoặc không hợp lệ.";
                    } else {
                        Throwable rootCause = e.getMostSpecificCause();
                        specificMessage += (rootCause != null ? rootCause.getMessage() : e.getMessage());
                    }
                }
                response.errorResponse(specificMessage);
                return response;
            }

            if (savedUser.getId() != null && userModelRequest.getAddress() != null && !userModelRequest.getAddress().isEmpty()) {
                log.info("Processing addresses for new user ID: {}", savedUser.getId());
                try {
                    List<AddressModel> addressesToAdd = userModelRequest.getAddress().stream()
                            .filter(addr -> addr.getStage() != null && addr.getStage() == 1)
                            .peek(addr -> addr.setId(null))
                            .collect(Collectors.toList());
                    if (!addressesToAdd.isEmpty()) {
                        addressService.processUserAddresses(savedUser, addressesToAdd);
                    }
                } catch (Exception e_addr) {
                    log.error("Error processing addresses for new user ID {}: {}", savedUser.getId(), e_addr.getMessage(), e_addr);
                }
            }

            if (generatedPassword != null && savedUser.getEmail() != null && !savedUser.getEmail().trim().isEmpty()) {
                UserEntity finalUserForMail = savedUser;
                String finalPasswordForMail = generatedPassword;
                log.info("Preparing to send account information email to {} for user ID {}", savedUser.getEmail(), savedUser.getId());
                Executors.newSingleThreadExecutor().execute(() -> sendMail(finalUserForMail, finalPasswordForMail));
            } else {
                if (generatedPassword == null) {
                    log.warn("Password was not generated for user ID {}. Email not sent.", savedUser.getId());
                }
                if (savedUser.getEmail() == null || savedUser.getEmail().trim().isEmpty()) {
                    log.warn("Email is empty for user ID {}. Account information email not sent.", savedUser.getId());
                }
            }

            response.successResponse(savedUser.getId(), "Thêm người dùng thành công. Mật khẩu đã được gửi tới email người dùng.");
            return response;

        } catch (Exception e) {
            log.error("Unexpected error in createNewUser: ", e);
            response.errorResponse("Lỗi hệ thống không mong muốn khi tạo người dùng: " + e.getMessage());
            return response;
        }
    }

    @Override
    @Transactional
    public BaseResponseModel<Integer> updateUserProfile(UserModel userModelRequest, List<MultipartFile> files) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        log.info("Attempting to update profile for user ID: {}", userModelRequest.getId());

        try {
            Integer userIdToUpdate = userModelRequest.getId();
            if (userIdToUpdate == null) {
                response.errorResponse("ID người dùng là bắt buộc để cập nhật.");
                return response;
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserEntity currentUserEntity = null;
            Integer userPerformingActionId = userIdToUpdate;

            if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
                currentUserEntity = userRepository.findUserEntitiesByUserNameAndStatus(authentication.getName(), 1).orElse(null);
                if (currentUserEntity != null) {
                    userPerformingActionId = currentUserEntity.getId();
                    String currentUserRoleCode = currentUserEntity.getRoleEntity().getCode();
                    if (!currentUserEntity.getId().equals(userIdToUpdate) &&
                            !(currentUserRoleCode.equals("ADMIN") || currentUserRoleCode.equals("EMPLOYEE"))) {
                        response.errorResponse("Bạn không có quyền cập nhật thông tin người dùng này.");
                        return response;
                    }
                } else {
                    response.errorResponse("Phiên đăng nhập không hợp lệ.");
                    return response;
                }
            } else {
                response.errorResponse("Yêu cầu không được xác thực.");
                return response;
            }

            Optional<UserEntity> optionalUser = userRepository.findUserEntitiesById(userIdToUpdate); // Sử dụng findUserEntitiesById
            if (!optionalUser.isPresent()) {
                response.errorResponse("Không tìm thấy người dùng với ID: " + userIdToUpdate + " để cập nhật.");
                return response;
            }
            UserEntity entityToSave = optionalUser.get();

            if (userModelRequest.getRoleId() != null && currentUserEntity != null && "ADMIN".equals(currentUserEntity.getRoleEntity().getCode())) {
                if (!userModelRequest.getRoleId().equals(entityToSave.getRoleEntity().getId().intValue())) { // Giả sử RoleEntity.id là Long, UserModel.roleId là Integer
                    RoleEntity newRole = roleRepository.findRoleEntitiesById(userModelRequest.getRoleId().longValue()).orElse(null);
                    if (newRole != null) {
                        entityToSave.setRoleEntity(newRole);
                    } else {
                        log.warn("Role ID {} for update not found, keeping current role for user {}", userModelRequest.getRoleId(), userIdToUpdate);
                    }
                }
            }

            if (userModelRequest.getFullName() != null && !userModelRequest.getFullName().trim().isEmpty()) {
                entityToSave.setFullName(userModelRequest.getFullName());
            }

            // === THAY ĐỔI CÁCH KIỂM TRA EMAIL TRÙNG LẶP ===
            if (userModelRequest.getEmail() != null && !userModelRequest.getEmail().equals(entityToSave.getEmail())) {
                List<UserEntity> usersWithSameEmail = userRepository.getUserEntitiesByEmail(userModelRequest.getEmail());
                // Kiểm tra xem có user nào khác (không phải user hiện tại) sở hữu email mới này không
                if (usersWithSameEmail != null && !usersWithSameEmail.isEmpty()) {
                    boolean emailTakenByOtherUser = usersWithSameEmail.stream()
                            .anyMatch(u -> !u.getId().equals(entityToSave.getId()));
                    if (emailTakenByOtherUser) {
                        response.errorResponse("Email '" + userModelRequest.getEmail() + "' đã được sử dụng bởi người dùng khác.");
                        return response;
                    }
                }
                entityToSave.setEmail(userModelRequest.getEmail());
            }


            if (userModelRequest.getPhoneNumber() != null) {
                entityToSave.setPhoneNumber(userModelRequest.getPhoneNumber());
            }
            entityToSave.setGender(userModelRequest.isGender());
            if (userModelRequest.getDateBirth() != null) {
                entityToSave.setDateBirth(userModelRequest.getDateBirth().toLocalDate());
            }
            if (userModelRequest.getDescription() != null) {
                entityToSave.setDescription(userModelRequest.getDescription());
            }
            if (userModelRequest.getStatus() != null) {
                entityToSave.setStatus(userModelRequest.getStatus());
            }

            entityToSave.setUpdatedDate(LocalDateTime.now());
            entityToSave.setUpdatedBy(userPerformingActionId);

            if (files != null && !files.isEmpty()) {
                try {
                    String imageUrl = handleImageService.saveFileImage(files.get(0));
                    entityToSave.setImageUrl(imageUrl);
                } catch (Exception e) {
                    log.error("Error saving image file during profile update: {}", e.getMessage());
                }
            }

            UserEntity savedUser;
            try {
                savedUser = userRepository.saveAndFlush(entityToSave);
            } catch (DataIntegrityViolationException e) {
                log.error("DataIntegrityViolationException while updating user profile: {}", e.getMessage(), e);
                String specificMessage = "Lỗi ràng buộc dữ liệu khi cập nhật.";
                if (e.getMessage() != null) {
                    if (e.getMessage().toLowerCase().contains("fullname") || e.getMessage().toLowerCase().contains("full_name")) {
                        specificMessage = "Họ và tên không được để trống hoặc đã vi phạm ràng buộc.";
                    } else if (e.getMessage().toLowerCase().contains("email")) {
                        specificMessage = "Email đã tồn tại hoặc không hợp lệ.";
                    } else {
                        Throwable rootCause = e.getMostSpecificCause();
                        specificMessage += (rootCause != null ? rootCause.getMessage() : e.getMessage());
                    }
                }
                response.errorResponse(specificMessage);
                return response;
            }

            boolean addressProcessingSuccess = true;
            if (savedUser.getId() != null && userModelRequest.getAddress() != null) {
                log.info("Processing addresses for updated user ID: {}", savedUser.getId());
                try {
                    addressService.processUserAddresses(savedUser, userModelRequest.getAddress());
                } catch (Exception e_addr) {
                    log.error("Error processing addresses for updated user ID {}: {}", savedUser.getId(), e_addr.getMessage(), e_addr);
                    addressProcessingSuccess = false;
                    response.setMessage("Cập nhật thông tin cá nhân thành công, nhưng có lỗi khi xử lý địa chỉ: " + e_addr.getMessage());
                }
            }

            if (addressProcessingSuccess) {
                response.successResponse(savedUser.getId(), "Cập nhật thông tin người dùng thành công");
            } else {
                response.setSuccess(false);
                response.setData(savedUser.getId());
            }
            return response;

        } catch (Exception e) {
            log.error("Unexpected error in updateUserProfile: ", e);
            response.errorResponse("Lỗi hệ thống không mong muốn khi cập nhật thông tin: " + e.getMessage());
            return response;
        }
    }

    private void sendMail(UserEntity entity, String pwd) {
        if (entity.getEmail() == null || entity.getEmail().trim().isEmpty()) {
            log.warn("Cannot send mail to user {} with ID {} because email is empty.", entity.getUsername(), entity.getId());
            return;
        }
        SendMailModel sendMailModel = new SendMailModel();
        sendMailModel.setPassword(pwd);
        sendMailModel.setToMail(entity.getEmail());
        sendMailModel.setSubject("Thông tin tài khoản - BOOKSTORE");
        sendMailModel.setFullName(entity.getFullName());
        sendMailModel.setUserName(entity.getUsername());
        try {
            handleMailService.sendMailMime(sendMailModel);
            log.info("Account information email successfully sent to {} for user ID {}", entity.getEmail(), entity.getId());
        } catch (Exception e) {
            log.error("Failed to send account information email to {} for user ID {}: {}", entity.getEmail(), entity.getId(), e.getMessage(), e);
        }
    }

    @Override
    public BaseResponseModel<Integer> deleteUser(Integer id, Integer status) {
        BaseResponseModel<Integer> response = new BaseResponseModel<>();
        try {
            Optional<UserEntity> userOptional = userRepository.findUserEntitiesById(id); // Sử dụng findUserEntitiesById
            if (!userOptional.isPresent()) {
                response.errorResponse("ID người dùng không tồn tại");
                return response;
            }
            UserEntity user = userOptional.get();
            user.setStatus(status);
            if (status == 0) {
                user.setIsDeleted(0);
            } else if (status == 1) {
                user.setIsDeleted(0);
            }

            UserEntity userEntity = userRepository.saveAndFlush(user);
            if (userEntity.getId() != null) {
                String message = status == 1 ? "Người dùng đã được mở khóa thành công" : "Người dùng đã được khóa thành công";
                response.successResponse(id, message);
            } else {
                response.errorResponse("Cập nhật trạng thái người dùng thất bại");
            }
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
        }
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public BaseResponseModel<UserModel> getUserDetail(Integer id) {
        BaseResponseModel<UserModel> response = new BaseResponseModel<>();
        try {
            Optional<UserEntity> userOptional = userRepository.findUserEntitiesById(id); // Sử dụng findUserEntitiesById
            if (!userOptional.isPresent()) {
                response.errorResponse("ID người dùng không tồn tại: " + id);
                return response;
            }
            UserEntity user = userOptional.get();
            UserModel userModel = user.toUserModel();
            response.successResponse(userModel, "Lấy chi tiết người dùng thành công.");
        } catch (Exception e) {
            log.error("Lỗi khi lấy chi tiết người dùng cho ID {}: {}", id, e.getMessage(), e);
            response.errorResponse("Lỗi khi lấy chi tiết người dùng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public BaseListResponseModel<UserModel> getListUser( // SỬA: Kiểu trả về là BaseListResponseModel<UserModel>
                                                         String keySearch, Integer status, Integer roleId, Boolean gender, Pageable pageable) {

        // T_ITEM của BaseListResponseModel là UserModel
        BaseListResponseModel<UserModel> response = new BaseListResponseModel<>();
        try {
            List<Integer> roleIds = (roleId != null) ? List.of(roleId) : null;
            // Giả sử userRepository.getListUser trả về Page<UserEntity>
            Page<UserEntity> userEntities = userRepository.getListUser(keySearch, status, roleIds, gender, pageable);

            int currentPageIndex = pageable.getPageNumber() + 1;
            int currentPageSize = pageable.getPageSize();

            if (userEntities == null || userEntities.getContent().isEmpty()) {
                // Gọi phương thức successResponse của BaseListResponseModel
                // (phiên bản 5 tham số bạn đã định nghĩa)
                // listData ở đây là List<UserModel> (khớp với T_ITEM là UserModel)
                response.successResponse(new ArrayList<UserModel>(), 0, "Danh sách người dùng trống", currentPageIndex, currentPageSize);
            } else {
                List<UserModel> userModels = userEntities.getContent().stream()
                        .map(UserEntity::toUserModel) // Giả sử UserEntity có toUserModel()
                        .collect(Collectors.toList());
                // listData ở đây là List<UserModel>
                response.successResponse(userModels, (int) userEntities.getTotalElements(), "Lấy danh sách người dùng thành công", currentPageIndex, currentPageSize);
            }
        } catch (Exception e) {
            log.error("Error getting user list: {}", e.getMessage(), e);
            // Gọi phương thức errorResponse của BaseListResponseModel
            // (phiên bản 3 tham số bạn đã định nghĩa)
            response.errorResponse("Lỗi khi lấy danh sách người dùng: " + e.getMessage(),
                    pageable.getPageNumber() + 1,
                    pageable.getPageSize());
        }
        return response;
    }

    @Override
    public BaseResponseModel<LoginResponse<UserModel>> loginUser(LoginRequest request) {
        BaseResponseModel<LoginResponse<UserModel>> response = new BaseResponseModel<>();
        try {
            UserEntity userEntity = userRepository.findUserEntitiesByUserNameAndStatus(request.getUserName(), 1).orElse(null);
            if (userEntity == null) {
                response.errorResponse("Tên đăng nhập hoặc mật khẩu không chính xác.");
                return response;
            }
            String passwordHash = hashService.md5Hash(request.getPassword());
            if (!userEntity.getPassword().equals(passwordHash)) {
                response.errorResponse("Tên đăng nhập hoặc mật khẩu không chính xác.");
                return response;
            }
            UserModel userModel = userEntity.toUserModel();

            String token = jwtService.generateToken(userEntity);
            LoginResponse<UserModel> loginResponse = new LoginResponse<>();
            loginResponse.setToken(token);
            loginResponse.setTokeType("Bearer");
            loginResponse.setExpiresIn(jwtService.getExpirationTime());
            loginResponse.setData(userModel);
            response.successResponse(loginResponse, "Đăng nhập thành công");
        } catch (Exception e) {
            response.errorResponse(e.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public BaseResponseModel<UserModel> shortCreateCustomer(UserModel model) {
        BaseResponseModel<UserModel> response = new BaseResponseModel<>();
        UserEntity userCreatingAction = null;
        String generatedPassword = null;
        try {
            model.setRoleId(5);
            String errorString = userValidator.validateUser(model);
            if (StringUtils.hasText(errorString)) {
                response.errorResponse(errorString);
                return response;
            }
            if (userRepository.findByUserName(model.getUserName()).isPresent()) {
                response.errorResponse("Tên đăng nhập '" + model.getUserName() + "' đã tồn tại.");
                return response;
            }
            if (model.getFullName() == null || model.getFullName().trim().isEmpty()) {
                response.errorResponse("Họ và tên không được để trống khi tạo người dùng mới.");
                return response;
            }

            RoleEntity roleEntity = roleRepository.findRoleEntitiesById(5L).orElse(null);
            if (roleEntity == null) {
                response.errorResponse("Không tìm thấy vai trò mặc định cho khách hàng (ID: 5).");
                return response;
            }

            UserEntity entity = model.toUserEntity();
            entity.setId(null);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
                userCreatingAction = userRepository.findUserEntitiesByUserNameAndStatus(authentication.getName(), 1).orElse(null);
                if (userCreatingAction != null) entity.setCreatedBy(userCreatingAction.getId());
            }
            entity.setCreatedDate(LocalDateTime.now());
            entity.setUpdatedDate(LocalDateTime.now());
            if (userCreatingAction != null) entity.setUpdatedBy(userCreatingAction.getId());

            generatedPassword = utilService.generatePassword();
            entity.setPassword(hashService.md5Hash(generatedPassword));
            entity.setRoleEntity(roleEntity);
            entity.setStatus(1);
            entity.setIsDeleted(0);

            UserEntity userSave = userRepository.saveAndFlush(entity);

            if (userSave.getId() != null) {
                if (model.getAddress() != null && !model.getAddress().isEmpty()) {
                    try {
                        addressService.processUserAddresses(userSave, model.getAddress());
                    } catch (Exception e_addr) {
                        log.error("Error processing addresses for short created customer ID {}: {}", userSave.getId(), e_addr.getMessage(), e_addr);
                    }
                }

                Optional<UserEntity> finalUserOpt = userRepository.findUserEntitiesById(userSave.getId()); // Sử dụng findUserEntitiesById
                if(finalUserOpt.isPresent()){
                    UserModel createdUserModel = finalUserOpt.get().toUserModel();
                    if (generatedPassword != null && finalUserOpt.get().getEmail() != null && !finalUserOpt.get().getEmail().trim().isEmpty()) {
                        String finalPasswordForMail = generatedPassword;
                        Executors.newSingleThreadExecutor().execute(() -> sendMail(finalUserOpt.get(), finalPasswordForMail));
                    }
                    response.successResponse(createdUserModel, "Tạo khách hàng nhanh thành công. Mật khẩu đã được gửi tới email.");
                } else {
                    response.errorResponse("Lỗi khi lấy lại thông tin khách hàng vừa tạo.");
                }
            } else {
                response.errorResponse("Tạo khách hàng nhanh thất bại.");
            }
        } catch (Exception e) {
            log.error("Error in shortCreateCustomer: {}", e.getMessage(), e);
            response.errorResponse("Lỗi khi tạo khách hàng nhanh: " + e.getMessage());
        }
        return response;
    }

    @Override
    public BaseResponseModel<?> forgetUser(UserForgetRequest request) {
        BaseResponseModel<Object> response = new BaseResponseModel<>();
        // === THAY ĐỔI CÁCH XỬ LÝ KẾT QUẢ TỪ REPOSITORY ===
        UserEntity user = userRepository.findByUserNameAndEmail(request.getUserName(), request.getEmail());
        if (user == null) { // Kiểm tra null vì repository trả về UserEntity trực tiếp
            response.errorResponse("Thông tin tên đăng nhập hoặc email không chính xác.");
            return response;
        }
        String newPassword = utilService.generatePassword();
        user.setPassword(hashService.md5Hash(newPassword));
        userRepository.save(user);
        sendMail(user, newPassword);
        response.successResponse(null, "Mật khẩu mới đã được gửi vào email của bạn.");
        return response;
    }

    @Override
    public BaseResponseModel<?> changePass(UserChangePassRequest userChangeRequest) {
        BaseResponseModel<Object> response = new BaseResponseModel<>();
        Optional<UserEntity> userOptional = userRepository.findByUserName(userChangeRequest.getUsername());
        if (!userOptional.isPresent()) {
            response.errorResponse("Không tìm thấy người dùng.");
            return response;
        }
        UserEntity user = userOptional.get();

        if (!user.getPassword().equals(hashService.md5Hash(userChangeRequest.getPassword()))) {
            response.errorResponse("Mật khẩu cũ không chính xác.");
            return response;
        }
        if (userChangeRequest.getNewPassword() == null || userChangeRequest.getNewPassword().trim().isEmpty()){
            response.errorResponse("Mật khẩu mới không được để trống.");
            return response;
        }
        if (userChangeRequest.getNewPassword().equals(userChangeRequest.getPassword())){
            response.errorResponse("Mật khẩu mới không được trùng với mật khẩu cũ.");
            return response;
        }

        user.setPassword(hashService.md5Hash(userChangeRequest.getNewPassword()));
        userRepository.save(user);
        response.successResponse(null, "Đổi mật khẩu thành công.");
        return response;
    }
}