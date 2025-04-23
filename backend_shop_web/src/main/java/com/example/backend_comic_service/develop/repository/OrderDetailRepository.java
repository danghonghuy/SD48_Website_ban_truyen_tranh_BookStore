package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.OrderDetailEntity;
import com.example.backend_comic_service.develop.model.dto.StatisticalOrdersDTO;
import com.example.backend_comic_service.develop.model.dto.StatisticalOrdersDetailDTO;
import com.example.backend_comic_service.develop.model.mapper.OrderDetailGetListMapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetailEntity, Integer> {
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

    @Query(value = "SELECT CAST(sum(total) AS bigint) as totalRevenue, sum(quantity) as totalQuantity \n" +
            "FROM order_detail\n" +
            "WHERE created_date >= DATEADD(DAY, -DATEPART(WEEKDAY, GETDATE()) + 1, GETDATE())\n" +
            "  AND created_date < DATEADD(DAY, 7 - DATEPART(WEEKDAY, GETDATE()) + 1, GETDATE())", nativeQuery = true)
    StatisticalOrdersDetailDTO getStatisticalWeek();

    @Query(value = "SELECT CAST(sum(total) AS bigint)as totalRevenue, sum(quantity) as totalQuantity \n" +
            "FROM order_detail \n" +
            "WHERE CAST(created_date AS DATE) = CAST(GETDATE() AS DATE)", nativeQuery = true)
    StatisticalOrdersDetailDTO getStatisticalToday();

    @Query(value = "SELECT CAST(sum(total) AS bigint) as totalRevenue, sum(quantity) as totalQuantity \n" +
            "FROM order_detail \n" +
            "WHERE YEAR(created_date) = YEAR(GETDATE())\n" +
            "  AND MONTH(created_date) = MONTH(GETDATE())", nativeQuery = true)
    StatisticalOrdersDetailDTO getStatisticalMonth();

    @Query(value = "SELECT CAST(sum(total) AS bigint) as totalRevenue, sum(quantity) as totalQuantity \n" +
            "FROM order_detail \n" +
            "WHERE YEAR(created_date) = YEAR(GETDATE())", nativeQuery = true)
    StatisticalOrdersDetailDTO getStatisticalYear();
}
