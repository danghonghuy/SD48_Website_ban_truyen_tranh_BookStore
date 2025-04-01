package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.constants.OrderStatusEnum;
import lombok.*;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class LogActionOrderModel {
    private Integer id;
    private String description;
    private Integer statusId;
    private Date createdDate;
    private String name;

    public String getStatusString(){
        if(statusId == null){
            return "";
        }
        if(statusId.equals(OrderStatusEnum.ORDER_STATUS_WAITING_ACCEPT)){
            return "Chờ xác nhận";
        }
        if(statusId.equals(OrderStatusEnum.ORDER_STATUS_ACCEPT)){
            return "Xác nhận";
        }
        if(statusId.equals(OrderStatusEnum.ORDER_STATUS_DELIVERY)){
            return "Đang giao hàng";
        }
        if(statusId.equals(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY)){
            return "Giao hàng thành công";
        }
        if(statusId.equals(OrderStatusEnum.ORDER_STATUS_SUCCESS)){
            return "Hoàn thành";
        }
        return "Thất bại";
    }
}
