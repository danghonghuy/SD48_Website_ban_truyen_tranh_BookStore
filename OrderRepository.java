package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.OrderEntity;
import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.model.dto.StatisticalOrdersDTO;
import com.example.backend_comic_service.develop.model.mapper.OrderGetListMapper;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {
    @Query(value = "select MAX(id) from [dbo].[orders]", nativeQuery = true)
    Integer getIdGenerateCode();
    @Modifying
    @Transactional
    @Query(value = "update orders set [status] = ?1 where id = ?2", nativeQuery = true)
    void updateOrderStatus(OrderStatusEnum status, Integer orderId);
    @Query(value = "    select\n" +
            "        od.id as orderId,\n" +
            "        od.code as orderCode,\n" +
            "        FORMAT(od.order_date, 'dd/MM/yyyy') as orderDate,\n" +
            "        cast(od.total_price as int) as totalPrice,\n" +
            "        od.status as orderStatus,\n" +
            "        od.stage as orderStage,\n" +
            "        cast(od.fee_delivery as int) as feeDelivery,\n" +
            "        od.payment_id as paymentId,\n" +
            "        p.[name] as paymentName,\n" +
            "        od.user_id as userId,\n" +
            "        u.full_name as customerName,\n" +
            "        u.phone_number as phoneNumber,\n" +
            "        od.employee_id as employeeId,\n" +
            "        emp.full_name as employeeName,\n" +
            "        od.type as orderType,\n" +
            "         CONCAT(ad.address_detail, ' - ', ward.name, ' - ', distr.name, ' - ', province.name) as addressDetail,\n" +
            "        d.[name] as deliveryName,\n" +
            "        od.delivery_type as deliveryType,\n" +
            "        od.address_id as addressId         \n" +
            "    from\n" +
            "        orders od        \n" +
            "    left outer join\n" +
            "        users u              \n" +
            "            on od.[user_id] = u.id              \n" +
            "    left outer join\n" +
            "        payments p              \n" +
            "            on od.payment_id = p.id       \n" +
            "    left outer join\n" +
            "        users emp              \n" +
            "            on od.employee_id = emp.id       \n" +
            "    left outer join\n" +
            "        [address] ad              \n" +
            "            on od.address_id = ad.id       \n" +
            "    left outer join\n" +
            "        delivery d              \n" +
            "            on od.delivery_type = d.id \n" +
            "    left outer join provinces province\n" +
            "\t        on province.code = ad.province_id\n" +
            "    left outer join districts distr\n" +
            "\t        on distr.code = ad.district_id\n" +
            "    left outer join wards ward\n" +
            "\t        on ward.code = ad.ward_id\n" +
            " where od.[user_id] = isnull(?1, od.[user_id])\n" +
            "      and od.payment_id = isnull(?2, od.payment_id)\n" +
            "  and od.employee_id = isnull(?3, od.employee_id)\n" +
            "  and od.[status] = isnull(?4, od.[status])\n" +
            "  and od.stage = isnull(?5, od.stage)\n" +
            "  and od.[type] = isnull(?6, od.[type])\n" +
            "  and od.total_price between isnull(?7, od.total_price) and isnull(?8, od.total_price)\n" +
            "  and od.order_date between isnull(?9, od.order_date) and isnull(?10, od.order_date)", nativeQuery = true)
    Page<OrderGetListMapper> getListOrder(Integer userId, Integer paymentId, Integer employeeId, Integer status, Integer stage, Integer type, Integer startPrice, Integer endPrice, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);


    @Query(value = "SELECT o.status as status, count(o.id) as totalCount \n" +
            "FROM orders o\n" +
            "WHERE o.updated_date >= DATEADD(DAY, -DATEPART(WEEKDAY, GETDATE()) + 1, GETDATE())\n" +
            "  AND o.updated_date < DATEADD(DAY, 7 - DATEPART(WEEKDAY, GETDATE()) + 1, GETDATE())\n" +
            "group by status", nativeQuery = true)
    List<StatisticalOrdersDTO> getStatisticalWeek();

    @Query(value = "SELECT status as status, count(id) as totalCount \n" +
            "FROM orders \n" +
            "WHERE CAST(updated_date AS DATE) = CAST(GETDATE() AS DATE) " +
            "group by status", nativeQuery = true)
    List<StatisticalOrdersDTO> getStatisticalToday();

    @Query(value = "SELECT status as status, count(id) as totalCount \n" +
            "FROM orders \n" +
            "WHERE YEAR(updated_date) = YEAR(GETDATE())\n" +
            "  AND MONTH(updated_date) = MONTH(GETDATE()) " +
            "group by status", nativeQuery = true)
    List<StatisticalOrdersDTO> getStatisticalMonth();

    @Query(value = "SELECT status as status, count(id) as totalCount \n" +
            "FROM orders \n" +
            "WHERE YEAR(updated_date) = YEAR(GETDATE())\n" +
            "group by status", nativeQuery = true)
    List<StatisticalOrdersDTO> getStatisticalYear();

    @Modifying
    @Transactional
    @Query(value = "update orders set status = ?1, updated_date = getdate() where status = ?2 and type = ?3 and" +
            " convert(date, updated_date) = convert(date, getdate())", nativeQuery = true)
    void resetOrderInCounterOutDate(Integer statusTarget, Integer statusCondition , Integer type);

    @Query(value = "SELECT o.status as status, count(o.id) as totalCount \n" +
            "FROM orders o\n" +
            "WHERE o.updated_date >= ?1 AND o.updated_date < ?2 \n" +
            "group by status", nativeQuery = true)
    List<StatisticalOrdersDTO> getStatisticalFromTo(LocalDateTime fromDate, LocalDateTime toDate);

    @Transactional
    @Modifying
    @Query(value = "update orders set user_id = null, address_id = null where id = ?1", nativeQuery = true)
    void updateAddress(Integer orderId);
}