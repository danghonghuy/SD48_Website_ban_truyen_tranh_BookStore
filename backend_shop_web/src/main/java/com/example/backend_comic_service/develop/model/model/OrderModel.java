package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.constants.OrderStatusEnum;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderModel {
    private Integer id;
    private String code;
    private Date orderDate;
    private Integer userId;
    private Integer paymentId;
    private Double totalPrice;
    private Integer status;
    private Integer stage;
    private Integer feeDelivery;
    private String description;
    private Integer employeeId;
    /// Has two type order: order in counter and order throw website: order in counter type: 1 and website type: 2
    private Integer type;
    private Integer realPrice;
    private Date createdDate;
    private Integer createdBy;
    private Date updatedDate;
    private Integer updatedBy;
    private Integer addressId;
    private Integer deliveryType;
    private List<OrderDetailModel> orderDetailModels;
    private String couponCode;
    private UserModel userModel;
        /// 1 is customer retail 2 is customer register use service
        private Integer userType;

    private DeliveryModel deliveryModel;
    private PaymentModel paymentModel;
    private AddressModel addressModel;
    private Integer couponId;
    private CouponModel couponModel;
    private List<LogActionOrderModel> logActionOrderModels;
    public String getTypeString(){
        if(type == 1){
            return "Đặt đơn tại quây";
        }
        return "Đơn online";
    }
    public String getStatusString(){
        if(status == null){
            return "";
        }
        if(status.equals(OrderStatusEnum.ORDER_STATUS_WAITING_ACCEPT)){
            return "Tạo đơn hàng";
        }
        if(status.equals(OrderStatusEnum.ORDER_STATUS_ACCEPT)){
            return "Xác nhận";
        }
        if(status.equals(OrderStatusEnum.ORDER_STATUS_DELIVERY)){
            return "Đang giao hàng";
        }
        if(status.equals(OrderStatusEnum.ORDER_STATUS_FINISH_DELIVERY)){
            return "Giao hàng thành công";
        }
        if(status.equals(OrderStatusEnum.ORDER_STATUS_SUCCESS)){
            return "Hoàn thành";
        }
        return "Thất bại";
    }
}
