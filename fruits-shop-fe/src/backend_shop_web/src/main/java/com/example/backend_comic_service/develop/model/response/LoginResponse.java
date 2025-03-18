package com.example.backend_comic_service.develop.model.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class LoginResponse <T>{
    private String token;
    private String tokeType;
    private Long expiresIn;
    private T data;
}
