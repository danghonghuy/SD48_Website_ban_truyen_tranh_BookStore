package com.example.backend_comic_service.develop.model.request;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class LoginRequest {
    private String userName;
    private String password;
}
