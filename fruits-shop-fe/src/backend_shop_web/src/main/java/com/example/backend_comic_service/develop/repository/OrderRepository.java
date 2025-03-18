package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.OrderEntity;
import com.example.backend_comic_service.develop.model.mapper.OrderGetListMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {
    @Query(value = "update orders set [status] = ?1 where id = ?2", nativeQuery = true)
    void updateOrderStatus(Integer status, Integer orderId);
    @Query(value = "select od.id as orderId, \n" +
            "       od.code as orderCode, \n" +
            "   od.order_date as orderDate, \n" +
            "   od.total_price as totalPrice, \n" +
            "   od.status as orderStatus, \n" +
            "   od.stage as orderStage, \n" +
            "   od.fee_delivery as feeDelivery, \n" +
            "   od.payment_id as paymentId, \n" +
            "   p.[name] as paymentName, \n" +
            "   od.user_id as userId, \n" +
            "   u.full_name as customerName, \n" +
            "   od.employee_id as employeeId, \n" +
            "   emp.full_name as employeeName, \n" +
            "   od.type as orderType, \n" +
            "   ad.address_detail as addressDetail, \n" +
            "   d.[name] as deliveryName, \n" +
            "   od.delivery_type as deliveryType, \n" +
            "   od.address_id as addressId\n" +
            "   from orders od   left outer join users u on od.[user_id] = u.id\n" +
            "        left outer join payments p on od.payment_id = p.id\n" +
            " left outer join users emp on od.employee_id = emp.id\n" +
            " left outer join [address] ad on od.address_id = ad.id\n" +
            " left outer join delivery d on od.delivery_type = d.id\n" +
            " where od.[user_id] = isnull(1, od.[user_id])\n" +
            "      and od.payment_id = isnull(1, od.payment_id)\n" +
            "  and od.employee_id = isnull(1, od.employee_id)\n" +
            "  and od.[status] = isnull(1, od.[status])\n" +
            "  and od.stage = isnull(1, od.stage)\n" +
            "  and od.[type] = isnull(1, od.[type])\n" +
            "  and od.total_price between isnull(0, od.total_price) and isnull(0, od.total_price)\n" +
            "  and od.order_date between isnull(GETDATE(), od.order_date) and isnull(GETDATE(), od.order_date)", nativeQuery = true)
    List<OrderGetListMapper> getListOrder(Integer userId, Integer paymentId, Integer employeeId, Integer status, Integer stage, Integer type, Integer startPrice, Integer endPrice, Date startDate, Date endDate, Pageable pageable);
}
