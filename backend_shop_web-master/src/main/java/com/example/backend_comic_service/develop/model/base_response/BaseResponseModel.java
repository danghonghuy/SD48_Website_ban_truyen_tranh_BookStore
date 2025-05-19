package com.example.backend_comic_service.develop.model.base_response;

import com.example.backend_comic_service.develop.constants.CodeResponseEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BaseResponseModel<T> {
    private Integer code;
    private String message;
    private boolean success;
    private T data;

    public void successResponse(T data,String message) {
        this.setData(data);
        this.setSuccess(true);
        this.setMessage(message);
        this.setCode(CodeResponseEnum.SUCCESS);
    }

    public void errorResponse(String message) {
        this.setData(null);
        this.setSuccess(false);
        this.setMessage(message);
        this.setCode(CodeResponseEnum.ERROR);
    }
}
