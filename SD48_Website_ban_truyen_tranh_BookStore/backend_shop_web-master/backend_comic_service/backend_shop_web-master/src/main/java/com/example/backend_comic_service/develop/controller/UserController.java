package com.example.backend_comic_service.develop.controller;

import com.example.backend_comic_service.develop.model.base_response.BaseListResponseModel; // Thêm import này
import com.example.backend_comic_service.develop.model.base_response.BaseResponseModel;
import com.example.backend_comic_service.develop.model.model.UserChangePassRequest;
import com.example.backend_comic_service.develop.model.model.UserForgetRequest;
import com.example.backend_comic_service.develop.model.model.UserModel;
import com.example.backend_comic_service.develop.model.request.LoginRequest;
import com.example.backend_comic_service.develop.model.response.LoginResponse;
import com.example.backend_comic_service.develop.service.IUserService;
import com.example.backend_comic_service.develop.entity.UserEntity; // Import nếu cần để lấy ID từ Principal
import com.example.backend_comic_service.develop.repository.UserRepository; // Import nếu cần để lấy UserEntity từ username
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.User; // Nếu Principal là User của Spring
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping(value = "/api/user")
@Slf4j
public class UserController {

    @Autowired
    private IUserService userService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired // Thêm cái này nếu bạn cần query lại user bằng username từ Principal
    private UserRepository userRepository;


    private UserModel parseUserModelFromString(String modelJson) throws Exception {
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        byte[] bytes = modelJson.getBytes(StandardCharsets.ISO_8859_1);
        String utf8String = new String(bytes, StandardCharsets.UTF_8);
        return objectMapper.readValue(utf8String, UserModel.class);
    }

    @GetMapping("/generate-code")
    public BaseResponseModel<String> generateCode(@RequestParam(name = "prefix") String prefix) {
        return userService.generateCode(prefix);
    }

    @PostMapping("/register")
    public BaseResponseModel<Integer> register(@RequestPart(name = "model") String modelJson, @RequestPart(name = "files", required = false) List<MultipartFile> files) {
        try {
            UserModel userModel = parseUserModelFromString(modelJson);
            return userService.createNewUser(userModel, files);
        } catch (Exception e) {
            log.error("Error during user registration (POST /register): {}", e.getMessage(), e);
            BaseResponseModel<Integer> errorResponse = new BaseResponseModel<>();
            errorResponse.errorResponse("Đăng ký không thành công: " + e.getMessage());
            return errorResponse;
        }
    }

    @PutMapping("/profile/update")
    public BaseResponseModel<Integer> updateUserProfile(@RequestPart(name = "model") String modelJson, @RequestPart(name = "files", required = false) List<MultipartFile> files) {
        try {
            UserModel userModelFromRequest = parseUserModelFromString(modelJson); // userModelFromRequest.getId() sẽ là ID của user cần sửa (ví dụ: 1593)

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
                BaseResponseModel<Integer> errorResponse = new BaseResponseModel<>();
                errorResponse.errorResponse("Vui lòng đăng nhập để cập nhật thông tin.");
                return errorResponse;
            }

            String currentUsername = authentication.getName();
            UserEntity currentUserEntity = userRepository.findByUserName(currentUsername)
                    .orElse(null);

            if (currentUserEntity == null) {
                BaseResponseModel<Integer> errorResponse = new BaseResponseModel<>();
                errorResponse.errorResponse("Người dùng không tồn tại hoặc phiên đăng nhập không hợp lệ.");
                return errorResponse;
            }
            Integer currentUserId = currentUserEntity.getId(); // ID của người đang thực hiện hành động (Admin/Nhân viên)
            String currentUserRoleCode = currentUserEntity.getRoleEntity().getCode(); // Giả sử RoleEntity có getCode() trả về "ADMIN", "EMPLOYEE", "CUSTOMER"

            Integer targetUserId = userModelFromRequest.getId(); // ID của người dùng mà Admin/Nhân viên muốn cập nhật

            if (targetUserId == null) {
                BaseResponseModel<Integer> errorResponse = new BaseResponseModel<>();
                errorResponse.errorResponse("ID người dùng cần cập nhật không được cung cấp trong yêu cầu.");
                return errorResponse;
            }

            // Kiểm tra quyền:
            // 1. Người dùng có thể tự cập nhật thông tin của mình.
            // 2. Admin hoặc Employee có thể cập nhật thông tin của bất kỳ ai (bao gồm cả targetUserId).
            boolean canUpdate;
            if (targetUserId.equals(currentUserId)) {
                canUpdate = true; // Người dùng tự cập nhật
            } else if ("ADMIN".equals(currentUserRoleCode) || "EMPLOYEE".equals(currentUserRoleCode)) {
                canUpdate = true; // Admin hoặc Employee cập nhật người khác
            } else {
                canUpdate = false; // Các trường hợp khác không được phép
            }

            if (!canUpdate) {
                BaseResponseModel<Integer> errorResponse = new BaseResponseModel<>();
                errorResponse.errorResponse("Bạn không có quyền cập nhật thông tin của người dùng này.");
                return errorResponse;
            }

            // Không cần dòng này nữa, vì userModelFromRequest đã chứa đúng ID của người cần cập nhật (targetUserId)
            // userModelFromRequest.setId(currentUserId); // <--- BỎ HOẶC ĐIỀU CHỈNH CẨN THẬN

            // Đảm bảo rằng userModelFromRequest được truyền xuống service với ID là targetUserId
            // Nếu userModelFromRequest.getId() đã đúng là targetUserId thì không cần làm gì thêm.
            // Nếu có bất kỳ sự không chắc chắn nào, bạn có thể set lại:
            // userModelFromRequest.setId(targetUserId); // Dòng này có thể không cần thiết nếu parseUserModelFromString đã làm đúng

            log.info("User ID {} (Role: {}) is attempting to update user ID: {}", currentUserId, currentUserRoleCode, targetUserId);
            return userService.updateUserProfile(userModelFromRequest, files);

        } catch (Exception e) {
            log.error("Error during user profile update (PUT /profile/update): {}", e.getMessage(), e);
            BaseResponseModel<Integer> errorResponse = new BaseResponseModel<>();
            errorResponse.errorResponse("Cập nhật thông tin không thành công: " + e.getMessage());
            return errorResponse;
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
    // SỬA KIỂU TRẢ VỀ Ở ĐÂY: T_ITEM của BaseListResponseModel là UserModel
    public BaseListResponseModel<UserModel> getList(
            @RequestParam(name = "keySearch", required = false) String keySearch,
            @RequestParam(name = "status", required = false) Integer status,
            @RequestParam(name = "roleId", required = false) Integer roleId,
            @RequestParam(name = "gender", required = false) Boolean gender,
            @RequestParam(name = "pageIndex", defaultValue = "1") Integer pageIndex, // Thêm defaultValue
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) { // Thêm defaultValue

        // log.info(...) // Bạn có thể thêm log ở đây nếu muốn

        // Tạo Pageable, có thể thêm Sort nếu cần
        // Ví dụ: Sort.by("id").descending() hoặc Sort.by("fullName").ascending()
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize, Sort.by("id").descending());

        // Gọi service, giờ đây nó sẽ trả về đúng kiểu BaseListResponseModel<UserModel>
        return userService.getListUser(keySearch, status, roleId, gender, pageable);
    }


    @PostMapping("/create-short-user")
    public BaseResponseModel<UserModel> createUser(@RequestBody UserModel userModel) {
        try {
            return userService.shortCreateCustomer(userModel);
        } catch (Exception e) {
            log.error("Error during short customer creation: {}", e.getMessage(), e);
            BaseResponseModel<UserModel> errorResponse = new BaseResponseModel<>();
            errorResponse.errorResponse("Tạo khách hàng nhanh thất bại: " + e.getMessage());
            return errorResponse;
        }
    }

    @PostMapping("/forget-user")
    public BaseResponseModel<?> forgetUser(@RequestBody UserForgetRequest userForgetRequest) {
        try {
            return userService.forgetUser(userForgetRequest);
        } catch (Exception e) {
            log.error("Error during forget user: {}", e.getMessage(), e);
            BaseResponseModel<?> errorResponse = new BaseResponseModel<>();
            errorResponse.errorResponse("Yêu cầu quên mật khẩu thất bại: " + e.getMessage());
            return errorResponse;
        }
    }

    @PutMapping("/changePass")
    public BaseResponseModel<?> changePass(@RequestBody UserChangePassRequest userChangePassRequest) {
        try {
            return userService.changePass(userChangePassRequest);
        } catch (Exception e) {
            log.error("Error during change pass: {}", e.getMessage(), e);
            BaseResponseModel<?> errorResponse = new BaseResponseModel<>();
            errorResponse.errorResponse("Đổi mật khẩu thất bại: " + e.getMessage());
            return errorResponse;
        }
    }
}