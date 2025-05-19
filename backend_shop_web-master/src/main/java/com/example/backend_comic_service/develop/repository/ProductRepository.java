package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.ProductEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
    Optional<ProductEntity> findByCode(String code);
    @Query(value = "select MAX(id) from [dbo].[product]", nativeQuery = true)
    Integer getIdGenerateCode();
    @Query(value = "select * from [product] p where (len(isnull(?1, '')) <= 0 or p.[code] like '%' + ?1 + '%' " +
            "                                 or p.[name] like '%' + ?1 + '%' or p.[price] like '%' + ?1 + '%')\n" +
            "                                 and p.category_id = isnull(?2, p.category_id)\n" +
            "                                 and p.[type_id] = isnull(?3, p.[type_id])\n" +
            "                                 and p.[status] = isnull(?4, p.[status])\n" +
            "                                 and (p.[price] >= isnull(?5, p.[status]) and p.[price] <= isnull(?6, p.[price]))\n" +
            "                                 order by p.id desc", nativeQuery = true)
    Page<ProductEntity> getListProduct(String keySearch, Integer categoryId, Integer typeId, Integer status, Float minPrice, Float maxPrice, Pageable pageable);

    Optional<ProductEntity> findById(Integer id);
    @Query(value = "select * from product where id in (?1)", nativeQuery = true)
    List<ProductEntity> getListProductByIds(List<Integer> ids);
    @Modifying
    @Transactional
    @Query(value = "update [product] set [status] = ?2  where id = ?1", nativeQuery = true)
    void updateStatus(Integer id, Integer status);

    @Modifying
    @Transactional
    @Query(value = "update po\n" +
            "set po.stock = po.stock - od.quantity\n" +
            "from product po inner join order_detail od\n" +
            "on po.id = od.product_id\n" +
            "and order_id = ?1", nativeQuery = true)
    void updateMinusStock(Integer orderId);

    @Modifying
    @Transactional
    @Query(value = "update po\n" +
            "set po.stock = po.stock + od.use_quantity\n" +
            "from product po inner join order_detail od\n" +
            "on po.id = od.product_id\n" +
            "and order_id = ?1", nativeQuery = true)
    int updateAddStock(Integer orderId);

    @Query(value = "select * from product WHERE LOWER(name) like LOWER(N'%' + ?1 +'%')", nativeQuery = true)
    ProductEntity findByName(String name);

    @Query(value = "select * from product WHERE LOWER(name) like LOWER(N'%' + ?1 +'%')", nativeQuery = true)
    List<ProductEntity> findByNames(String name);

    @Query(value = "select TOP 5 a.* from product a, (select product_id, count(*) count_sell\n" +
            "                            from order_detail\n" +
            "                            group by product_id) b\n" +
            "where a.id = b.product_id\n" +
            "order by b.count_sell desc;", nativeQuery = true)
    List<ProductEntity> getListProductSellingBest();

    @Query(value = "select top 5 * from product order by stock asc;", nativeQuery = true)
    List<ProductEntity> getListProductRunningOut();

    @Modifying
    @Transactional
    @Query(value = "delete from order_detail where order_id = ?1", nativeQuery = true)
    void deleteOrderDetail(Integer orderId);
}
