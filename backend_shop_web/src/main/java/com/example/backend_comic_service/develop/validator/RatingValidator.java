package com.example.backend_comic_service.develop.validator;

import com.example.backend_comic_service.develop.model.model.RatingModel;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class RatingValidator {
    public String validate(RatingModel model) {
        if(model == null){
            return "Object invalid";
        }
        else if(model.getRate() == null || model.getRate() < 0){
            return "Rating point invalid";
        }
        else if(!StringUtils.hasText(model.getDescription())){
            return "Rating description invalid";
        }
        else if(model.getProductId() == null || model.getProductId() < 0){
            return "Product id invalid";
        }
        else if(model.getUserId() == null || model.getUserId() < 0){
            return "User id invalid";
        }
        return "";
    }
}
