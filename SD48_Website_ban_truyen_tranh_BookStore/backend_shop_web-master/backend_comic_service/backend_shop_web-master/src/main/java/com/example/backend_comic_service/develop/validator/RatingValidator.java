package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.model.model.RatingModel;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class RatingValidator {
    public String validate(RatingModel model) {
        if(model == null){
            return "Đánh giá không hợp lệ";
        }
        else if(model.getRate() == null || model.getRate() < 0){
            return "Điểm đánh giá không hợp lệ";
        }
        else if(!StringUtils.hasText(model.getDescription())){
            return "Mô tả đánh giá không hợp lệ";
        }
        else if(model.getProductId() == null || model.getProductId() < 0){
            return "ID sản phẩm không hợp lệ";
        }
        else if(model.getUserId() == null || model.getUserId() < 0){
            return "ID người dùng không hợp lệ";
        }
        return "";
    }
}
