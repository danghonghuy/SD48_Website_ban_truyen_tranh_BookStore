package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.OrderDetailEntity;
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
}
