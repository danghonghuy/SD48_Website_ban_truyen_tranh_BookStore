package com.example.backend_comic_service.develop.model.model;
import lombok.*;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDetailModel {
    private Integer id;
    private Integer productId;
    private Integer orderId;
    private Integer quantity;
    private Integer total;
    private Date createdDate;
    private Integer createdBy;
    private Date updatedDate;
    private Integer updatedBy;
    private Integer status;
    private Integer isDeleted;
    private Double price;
    private Double originPrice;
}
