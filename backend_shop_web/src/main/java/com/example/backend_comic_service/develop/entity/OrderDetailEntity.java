package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.OrderDetailModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.aspectj.weaver.ast.Or;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "order_detail")
public class OrderDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductEntity product;
    @ManyToOne
    @JoinColumn(name = "order_id")
    private OrderEntity order;
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "total")
    private Integer total;
    @Column(name = "created_date")
    private Date createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "updated_date")
    private Date updatedDate;
    @Column(name = "updated_by")
    private Integer updatedBy;
    @Column(name = "status")
    private Integer status;
    @Column(name = "is_deleted")
    private Integer isDeleted;
    @Column(name = "price")
    private Double price;
    @Column(name = "origin_price")
    private Double originPrice;
    public OrderDetailModel toModel(){
        OrderDetailModel orderDetailModel = new OrderDetailModel();
        orderDetailModel.setId(id);
        orderDetailModel.setQuantity(quantity);
        orderDetailModel.setTotal(total);
        orderDetailModel.setPrice(price);
        orderDetailModel.setOriginPrice(originPrice);
        orderDetailModel.setProductId(product.getId());
        orderDetailModel.setName(product.getName());
        orderDetailModel.setCode(product.getCode());
        orderDetailModel.setImage(!product.getImageEntities().isEmpty() ? product.getImageEntities().get(0).getImageUrl() : "");
        return orderDetailModel;
    }
}
