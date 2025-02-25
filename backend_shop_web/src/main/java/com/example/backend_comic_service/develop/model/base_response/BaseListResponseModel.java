package com.example.backend_comic_service.develop.model.base_response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BaseListResponseModel<T> extends  BaseResponseModel<T>{
    private Integer pageIndex;
    private Integer pageSize;
    private Integer totalCount;
    private T data;
}
