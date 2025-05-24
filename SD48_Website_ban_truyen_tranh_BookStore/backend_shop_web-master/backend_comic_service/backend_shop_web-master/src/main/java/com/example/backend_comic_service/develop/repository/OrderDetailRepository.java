package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.OrderDetailEntity;
import com.example.backend_comic_service.develop.entity.OrderEntity;
import com.example.backend_comic_service.develop.model.dto.StatisticalOrdersDetailDTO;
import com.example.backend_comic_service.develop.model.mapper.OrderDetailGetListMapper;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetailEntity, Integer> {

    // CHỌN MỘT TRONG HAI PHƯƠNG THỨC DƯỚI ĐÂY VÀ XÓA PHƯƠNG THỨC CÒN LẠI
    // Tùy thuộc vào tên trường trong OrderDetailEntity tham chiếu đến OrderEntity
    List<OrderDetailEntity> findByOrder(OrderEntity order);
    // HOẶC
    // List<OrderDetailEntity> findByOrderEntity(OrderEntity orderEntity);


    @Query(value = "update p set p.stock = (p.stock - od.quantity) from  [product] p inner join [order_detail] od on p.id = od.product_id \n" +
            " where od.order_id = ?1", nativeQuery = true)
    void updateStockProduct(Integer orderId);

    @Query(value = "select od.id as id, \n" +
            "       od.quantity as quantity, \n" +
            "\t   od.total as total, \n" +
            "\t   od.price as price, \n" +
            "\t   p.id as productId, \n" +
            "\t   p.[name] as productName, \n" +
            "\t   od.origin_price as originPrice\n" +
            " from order_detail od left outer join product p on od.product_id = p.id\n" +
            "                              where od.order_id = ?1", nativeQuery = true)
    List<OrderDetailGetListMapper> getListByOrderId(Integer orderId);

    @Query(value = "SELECT (select CAST(sum(c.amount) AS bigint) from log_payment_history c, orders d " +
            "Where CAST(c.created_date AS DATE) = CAST(GETDATE() AS DATE) and c.order_id = d.id and d.status = 5) as totalRevenue, sum(a.quantity) as totalQuantity \n" +
            "FROM order_detail a, orders b \n" +
            "WHERE CAST(a.updated_date AS DATE) = CAST(GETDATE() AS DATE) and a.order_id = b.id and b.status = 5", nativeQuery = true)
    StatisticalOrdersDetailDTO getStatisticalToday();

    @Query(value = "SELECT (select CAST(sum(c.amount) AS bigint) from log_payment_history c, orders d where YEAR(c.created_date) = YEAR(GETDATE())\n" +
            "  AND MONTH(c.created_date) = MONTH(GETDATE()) and c.order_id = d.id and d.status = 5) as totalRevenue, sum(a.quantity) as totalQuantity \n" +
            "FROM order_detail a, orders b \n" +
            "WHERE YEAR(a.updated_date) = YEAR(GETDATE())\n" +
            "  AND MONTH(a.updated_date) = MONTH(GETDATE()) and a.order_id = b.id and b.status = 5", nativeQuery = true)
    StatisticalOrdersDetailDTO getStatisticalMonth();

    @Query(value = "SELECT (select CAST(sum(c.amount) AS bigint) from log_payment_history c, orders d where YEAR(c.created_date) = YEAR(GETDATE()) and c.order_id = d.id and d.status = 5)" +
            " as totalRevenue, sum(a.quantity) as totalQuantity \n" +
            "FROM order_detail a, orders b \n" +
            "WHERE YEAR(a.updated_date) = YEAR(GETDATE()) and a.order_id = b.id and b.status = 5", nativeQuery = true)
    StatisticalOrdersDetailDTO getStatisticalYear();

    @Query(value = "SELECT (select CAST(sum(c.amount) AS bigint) from log_payment_history c, orders d where c.created_date >= DATEADD(DAY, -DATEPART(WEEKDAY, GETDATE()) + 1, GETDATE())\n" +
            "AND c.created_date < DATEADD(DAY, 7 - DATEPART(WEEKDAY, GETDATE()) + 1, GETDATE()) and c.order_id = d.id and d.status = 5) as totalRevenue, sum(a.quantity) as totalQuantity \n" +
            "FROM order_detail a, orders b\n" +
            "WHERE a.updated_date >= DATEADD(DAY, -DATEPART(WEEKDAY, GETDATE()) + 1, GETDATE())\n" +
            "  AND a.updated_date < DATEADD(DAY, 7 - DATEPART(WEEKDAY, GETDATE()) + 1, GETDATE()) and a.order_id = b.id and b.status = 5", nativeQuery = true)
    StatisticalOrdersDetailDTO getStatisticalWeek();

    @Query(value = "SELECT (select CAST(sum(c.amount) AS bigint) from log_payment_history c, orders d where" +
            " c.created_date >= ?1 AND c.created_date < ?2 and c.order_id = d.id and d.status = 5) as totalRevenue, sum(a.quantity) as totalQuantity \n" +
            "FROM order_detail a, orders b\n" +
            "WHERE a.updated_date >= ?1 AND a.updated_date < ?2 and a.order_id = b.id and b.status = 5", nativeQuery = true)
    StatisticalOrdersDetailDTO getStatisticalFromTo(LocalDateTime fromDate, LocalDateTime toDate);

    @Modifying
    @Transactional
    @Query(value = "update od\n" +
            "set od.use_quantity = od.quantity\n" +
            "from order_detail od\n" +
            "where od.order_id = ?1", nativeQuery = true)
    void updateUseQuantity(Integer orderId);

    @Query(value = "SELECT CAST(COALESCE(SUM(od.quantity), 0) AS INT) " +
            "FROM order_detail od " +
            "INNER JOIN orders o ON od.order_id = o.id " +
            "WHERE od.product_id = :productId AND o.status = :completedOrderStatus", nativeQuery = true)
    Integer calculateSoldQuantityForProduct(@Param("productId") Integer productId, @Param("completedOrderStatus") Integer completedOrderStatus);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM order_detail WHERE order_id = :orderId", nativeQuery = true)
    void deleteByOrderId(@Param("orderId") Integer orderId);
}