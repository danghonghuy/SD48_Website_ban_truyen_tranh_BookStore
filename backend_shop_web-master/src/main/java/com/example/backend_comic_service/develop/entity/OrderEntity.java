package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.model.model.OrderModel; // Import OrderModel
import com.example.backend_comic_service.develop.model.model.UserModel;   // Import UserModel
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors; // Import Collectors

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "orders")
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @ManyToOne
    @JoinColumn(name = "user_id") // Khách hàng
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "payment_id")
    private PaymentEntity payment;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "status")
    private Integer status;

    @Column(name = "stage")
    private Integer stage;

    @Column(name = "fee_delivery")
    private Integer feeDelivery;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "employee_id") // Nhân viên xử lý đơn hàng
    private UserEntity employee;

    @Column(name = "type")
    private Integer type;

    @Column(name = "real_price")
    private Integer realPrice;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "created_by") // ID của người tạo (có thể là nhân viên)
    private Integer createdBy;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "updated_by")
    private Integer updatedBy;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private AddressEntity address;

    @ManyToOne
    @JoinColumn(name = "delivery_type")
    private DeliveryEntity deliveryType;

    @Column(name = "coupon_id")
    private Integer couponId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderDetailEntity> orderDetailEntities;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LogPaymentHistoryEntity> paymentHistoryEntities;

    @Column(name = "user_type")
    private Integer userType;

    public OrderModel toModel(){
        OrderModel orderModel = new OrderModel();
        orderModel.setId(this.id);
        orderModel.setCode(this.code);
        orderModel.setOrderDate(this.orderDate);
        orderModel.setFeeDelivery(this.feeDelivery);
        orderModel.setRealPrice(this.realPrice);
        orderModel.setTotalPrice(this.totalPrice);

        // Thêm kiểm tra null cho các đối tượng trước khi gọi toModel() của chúng
        if (this.deliveryType != null) {
            orderModel.setDeliveryModel(this.deliveryType.toModel());
        }
        if (this.payment != null) {
            orderModel.setPaymentModel(this.payment.toModel());
        }
        if (this.user != null) { // Thông tin khách hàng
            orderModel.setUserModel(this.user.toUserModel());
        }
        if (this.orderDetailEntities != null && !this.orderDetailEntities.isEmpty()) {
            // Sử dụng Collectors.toList() thay vì toList() để tương thích rộng hơn (Java 8+)
            orderModel.setOrderDetailModels(this.orderDetailEntities.stream().map(OrderDetailEntity::toModel).collect(Collectors.toList()));
        }
        if (this.address != null) {
            orderModel.setAddressModel(this.address.toModel());
        }

        orderModel.setCouponId(this.couponId);
        orderModel.setType(this.type);
        orderModel.setUserType(this.userType);
        if (this.status != null) {
            orderModel.setStatus(OrderStatusEnum.fromValue(this.status));
        }
        orderModel.setCreatedDate(this.createdDate);
        orderModel.setUpdatedDate(this.updatedDate);
        orderModel.setUpdatedBy(this.updatedBy);

        // === PHẦN GÁN THÔNG TIN NHÂN VIÊN ===
        // Gán createdBy (ID của người tạo, có thể là nhân viên)
        orderModel.setCreatedBy(this.createdBy);
        if (this.employee != null) {
            orderModel.setEmployeeId(this.employee.getId()); // Gán ID của nhân viên
            orderModel.setEmployeeName(this.employee.getFullName()); // Gán TÊN nhân viên
            orderModel.setEmployeePhoneNumber(this.employee.getPhoneNumber()); // << GÁN SỐ ĐIỆN THOẠI NHÂN VIÊN
        } else {
            // Xử lý trường hợp không có thông tin employee
            orderModel.setEmployeeId(null);
            orderModel.setEmployeeName(null); // Hoặc "N/A"
            orderModel.setEmployeePhoneNumber(null); // Hoặc "N/A"
        }
        // Gán thông tin từ đối tượng employee (UserEntity của nhân viên)
        if (this.employee != null) {
            orderModel.setEmployeeId(this.employee.getId()); // Gán ID của nhân viên từ đối tượng employee

            // Nếu ba muốn frontend tự gọi API (Cách 2), thì chỉ cần employeeId và createdBy là đủ.
            // Nếu ba muốn backend gửi sẵn UserModel của nhân viên (Cách 1 - lý tưởng hơn),
            // thì bỏ comment đoạn dưới và đảm bảo OrderModel.java có trường staffUserModel.
            /*
            UserModel staffInfoForModel = new UserModel();
            staffInfoForModel.setId(this.employee.getId());
            staffInfoForModel.setFullName(this.employee.getFullName());
            staffInfoForModel.setPhoneNumber(this.employee.getPhoneNumber());
            staffInfoForModel.setEmail(this.employee.getEmail()); // Nếu cần
            // Ba có thể set thêm các trường khác của UserModel nếu UserEntity.toUserModel()
            // không phù hợp hoàn toàn hoặc chứa quá nhiều thông tin.
            // Hoặc nếu UserEntity.toUserModel() phù hợp:
            // UserModel staffInfoForModel = this.employee.toUserModel();

            orderModel.setStaffUserModel(staffInfoForModel); // Gán UserModel của nhân viên vào OrderModel
            */
        }
        // === KẾT THÚC PHẦN GÁN THÔNG TIN NHÂN VIÊN ===

        return orderModel;
    }
}