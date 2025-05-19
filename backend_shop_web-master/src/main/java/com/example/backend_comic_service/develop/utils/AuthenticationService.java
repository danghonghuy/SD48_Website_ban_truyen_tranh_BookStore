package com.example.backend_comic_service.develop.utils;

import com.example.backend_comic_service.develop.entity.UserEntity;
import com.example.backend_comic_service.develop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;


@Component
public class AuthenticationService {

    private final UserRepository userRepository;

    @Autowired
    public AuthenticationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserEntity authenToken(){
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            return userRepository.findUserEntitiesByUserNameAndStatus(username, 1).orElse(null);
        } catch (Exception e) {
           return null;
        }
    }

}
