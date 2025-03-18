package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.model.model.UserModel;
import com.example.backend_comic_service.develop.repository.UserRepository;
import com.example.backend_comic_service.develop.utils.UtilService;
import org.springframework.beans.factory.annotation.Autowired;
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
            return "User is null";
        }
        if(!StringUtils.hasText(model.getFullName())){
            return "Full name is null";
        }
        if(!StringUtils.hasText(model.getEmail())){
            return "Email is null";
        }else{
            if(!utilService.regexEmail(model.getEmail())){
                return "Email is not formatted correctly";
            }
        }
        if(!StringUtils.hasText(model.getPhoneNumber())){
            return "Phone number is null";
        }else{
            if(!utilService.regexPhoneNumber(model.getPhoneNumber())){
                return "Phone number is not formatted correctly";
            }
        }
        if(!StringUtils.hasText(model.getUserName())){
            return "Username is null";
        }
        if(!StringUtils.hasText(model.getPassword())){
            return "Password is null";
        }
        List<UserEntity> UserEntities = new ArrayList<>();
        UserEntities = userRepository.getUserEntitiesByEmail(model.getEmail());
        if(!UserEntities.isEmpty() && (model.getId() == null || (!model.getId().equals(UserEntities.get(0).getId())))){
            return "Email already exists";
        }
        UserEntities = userRepository.getUserEntitiesByUserName(model.getUserName());
        if(!UserEntities.isEmpty() && model.getId() != null){
            return "Username already exists";
        }
        UserEntities = userRepository.getUserEntitiesByPhoneNumber(model.getPhoneNumber());
        if(!UserEntities.isEmpty() && (model.getId() == null || (!model.getId().equals(UserEntities.get(0).getId())))){
            return "Phone number already exists";
        }
        return "";
    }
}
