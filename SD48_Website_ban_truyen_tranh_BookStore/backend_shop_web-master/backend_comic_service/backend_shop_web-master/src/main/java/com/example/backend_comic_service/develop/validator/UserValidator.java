package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.model.UserModel;
import com.example.backend_comic_service.develop.repository.UserRepository;
import com.example.backend_comic_service.develop.utils.UtilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserValidator {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UtilService utilService;

    public String validateUser(UserModel model){
        if(model == null){
            return "Người dùng không được để trống";
        }
        if(!StringUtils.hasText(model.getFullName())){
            return "Họ và tên không được để trống";
        }
        if(!StringUtils.hasText(model.getEmail())){
            return "Email không được để trống";
        }else{
            if(!utilService.regexEmail(model.getEmail())){
                return "Email không được định dạng đúng";
            }
        }
        if(!StringUtils.hasText(model.getPhoneNumber())){
            return "Số điện thoại không được để trống";
        }else{
            if(!utilService.regexPhoneNumber(model.getPhoneNumber())){
                return "Số điện thoại không được định dạng đúng";
            }
        }
        if(!StringUtils.hasText(model.getUserName())){
            return "Tên người dùng không được để trống";
        }
        List<UserEntity> UserEntities = new ArrayList<>();
        UserEntities = userRepository.getUserEntitiesByEmail(model.getEmail());
        if(!UserEntities.isEmpty() && (model.getId() == null || (!model.getId().equals(UserEntities.get(0).getId())))){
            return "Email đã tồn tại";
        }
        UserEntities = userRepository.getUserEntitiesByUserName(model.getUserName());
        if(!UserEntities.isEmpty() && (model.getId() == null || (!model.getId().equals(UserEntities.get(0).getId())))){
            return "Username đã tồn tại";
        }
        UserEntities = userRepository.getUserEntitiesByPhoneNumber(model.getPhoneNumber());
        if(!UserEntities.isEmpty() && (model.getId() == null || (!model.getId().equals(UserEntities.get(0).getId())))){
            return "Số điện thoại đã tồn tại";
        }
        return "";
    }
}
