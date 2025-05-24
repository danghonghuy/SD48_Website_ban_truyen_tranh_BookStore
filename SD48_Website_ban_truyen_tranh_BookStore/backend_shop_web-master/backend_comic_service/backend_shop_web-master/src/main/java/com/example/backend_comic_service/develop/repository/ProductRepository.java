package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
    Optional<ProductEntity> findByCode(String code);

    @Query(value = "select MAX(id) from [dbo].[product]", nativeQuery = true)
    Integer getIdGenerateCode();

    @Query(value = "SELECT p.id, p.code, p.name, p.description, p.date_publish, p.price, p.price_discount, " +
            "p.stock, p.format, p.created_date, p.created_by, p.updated_date, p.updated_by, " +
            "p.is_deleted, p.category_id, p.type_id, p.catalog, p.series, p.date_public, p.status, " +
            "p.publisher_id, p.distributor_id " +
            "FROM [product] p WHERE " +
            " (LEN(ISNULL(:keySearch, '')) <= 0 OR p.[code] LIKE CONCAT('%', :keySearch, '%') OR p.[name] LIKE CONCAT('%', :keySearch, '%'))\n" +
            " AND (:categoryId IS NULL OR p.category_id = :categoryId)\n" +
            " AND (:typeId IS NULL OR p.[type_id] = :typeId)\n" +
            " AND (:status IS NULL OR p.[status] = :status)\n" +
            " AND ( (:minPrice IS NULL) OR (p.[price] >= :minPrice) )\n" +
            " AND ( (:maxPrice IS NULL) OR (p.[price] <= :maxPrice) )\n", // <--- ĐÃ XÓA "ORDER BY p.id DESC" Ở CUỐI DÒNG NÀY
            countQuery = "SELECT count(*) FROM [product] p WHERE " + // <--- BẮT ĐẦU SỬA countQuery TỪ ĐÂY
                    " (LEN(ISNULL(:keySearch, '')) <= 0 OR p.[code] LIKE CONCAT('%', :keySearch, '%') OR p.[name] LIKE CONCAT('%', :keySearch, '%'))\n" +
                    " AND (:categoryId IS NULL OR p.category_id = :categoryId)\n" +
                    " AND (:typeId IS NULL OR p.[type_id] = :typeId)\n" +
                    " AND (:status IS NULL OR p.[status] = :status)\n" +
                    " AND ( (:minPrice IS NULL) OR (p.[price] >= :minPrice) )\n" +
                    " AND ( (:maxPrice IS NULL) OR (p.[price] <= :maxPrice) )", // <--- KẾT THÚC SỬA countQuery (đảm bảo nó có đủ các điều kiện WHERE)
            nativeQuery = true)
    Page<ProductEntity> getListProduct(@Param("keySearch") String keySearch,
                                       @Param("categoryId") Integer categoryId,
                                       @Param("typeId") Integer typeId,
                                       @Param("status") Integer status,
                                       @Param("minPrice") Float minPrice,
                                       @Param("maxPrice") Float maxPrice,
                                       Pageable pageable);

    @Query(value = "SELECT p.id, p.code, p.name, p.description, p.date_publish, p.price, p.price_discount, " +
            "p.stock, p.format, p.created_date, p.created_by, p.updated_date, p.updated_by, " +
            "p.is_deleted, p.category_id, p.type_id, p.catalog, p.series, p.date_public, p.status, " +
            "p.publisher_id, p.distributor_id " +
            "FROM [product] p WHERE " +
            " (LEN(ISNULL(:keySearch, '')) <= 0 OR p.[code] LIKE CONCAT('%', :keySearch, '%') OR p.[name] LIKE CONCAT('%', :keySearch, '%'))\n" +
            " AND (:categoryId IS NULL OR p.category_id = :categoryId)\n" +
            " AND (:typeId IS NULL OR p.[type_id] = :typeId)\n" +
            " AND (:status IS NULL OR p.[status] = :status)\n" +
            " AND ( (:minPrice IS NULL) OR (p.[price] >= :minPrice) )\n" +
            " AND ( (:maxPrice IS NULL) OR (p.[price] <= :maxPrice) )\n" +
            " ORDER BY p.id DESC", nativeQuery = true)
    List<ProductEntity> findAllProductsForExport(@Param("keySearch") String keySearch,
                                                 @Param("categoryId") Integer categoryId,
                                                 @Param("typeId") Integer typeId,
                                                 @Param("status") Integer status,
                                                 @Param("minPrice") Float minPrice,
                                                 @Param("maxPrice") Float maxPrice);

    @Query(value = "SELECT p.id, p.code, p.name, p.description, p.date_publish, p.price, p.price_discount, " +
            "p.stock, p.format, p.created_date, p.created_by, p.updated_date, p.updated_by, " +
            "p.is_deleted, p.category_id, p.type_id, p.catalog, p.series, p.date_public, p.status, " +
            "p.publisher_id, p.distributor_id " +
            "FROM product p WHERE id IN (:ids)", nativeQuery = true)
    List<ProductEntity> getListProductByIds(@Param("ids") List<Integer> ids);

    @Modifying
    @Transactional
    @Query(value = "update [product] set [status] = :newStatus  where id = :id", nativeQuery = true)
    void updateStatus(@Param("id") Integer id, @Param("newStatus") Integer status);

    @Modifying
    @Transactional
    @Query(value = "update po\n" +
            "set po.stock = po.stock - od.quantity\n" +
            "from product po inner join order_detail od\n" +
            "on po.id = od.product_id\n" +
            "where od.order_id = :orderId", nativeQuery = true)
    void updateMinusStock(@Param("orderId") Integer orderId);

    @Modifying
    @Transactional
    @Query(value = "update po\n" +
            "set po.stock = po.stock + od.use_quantity\n" +
            "from product po inner join order_detail od\n" +
            "on po.id = od.product_id\n" +
            "where od.order_id = :orderId", nativeQuery = true)
    int updateAddStock(@Param("orderId") Integer orderId);

    @Query(value = "SELECT p.id, p.code, p.name, p.description, p.date_publish, p.price, p.price_discount, " +
            "p.stock, p.format, p.created_date, p.created_by, p.updated_date, p.updated_by, " +
            "p.is_deleted, p.category_id, p.type_id, p.catalog, p.series, p.date_public, p.status, " +
            "p.publisher_id, p.distributor_id " +
            "FROM product p WHERE LOWER(p.name) = LOWER(CONCAT(N'', :name, N''))", nativeQuery = true)
    Optional<ProductEntity> findByNameExactly(@Param("name") String name);


    @Query(value = "SELECT p.id, p.code, p.name, p.description, p.date_publish, p.price, p.price_discount, " +
            "p.stock, p.format, p.created_date, p.created_by, p.updated_date, p.updated_by, " +
            "p.is_deleted, p.category_id, p.type_id, p.catalog, p.series, p.date_public, p.status, " +
            "p.publisher_id, p.distributor_id " +
            "FROM product p WHERE LOWER(p.name) like LOWER(CONCAT(N'%', :name, N'%'))", nativeQuery = true)
    List<ProductEntity> findByNames(@Param("name") String name);

    @Query(value = "SELECT TOP 5 p.id, p.code, p.name, p.description, p.date_publish, p.price, p.price_discount, " +
            "p.stock, p.format, p.created_date, p.created_by, p.updated_date, p.updated_by, " +
            "p.is_deleted, p.category_id, p.type_id, p.catalog, p.series, p.date_public, p.status, " +
            "p.publisher_id, p.distributor_id " +
            "FROM product p " +
            "INNER JOIN (SELECT product_id, SUM(quantity) AS total_quantity_sold " +
            "            FROM order_detail od_inner " +
            "            INNER JOIN orders o_inner ON od_inner.order_id = o_inner.id " +
            "            WHERE o_inner.status = 5 " + // Giả sử status 5 là hoàn thành
            "            GROUP BY product_id) sold_summary " +
            "ON p.id = sold_summary.product_id " +
            "ORDER BY sold_summary.total_quantity_sold DESC", nativeQuery = true)
    List<ProductEntity> getListProductSellingBest();

    @Query(value = "SELECT TOP 5 p.id, p.code, p.name, p.description, p.date_publish, p.price, p.price_discount, " +
            "p.stock, p.format, p.created_date, p.created_by, p.updated_date, p.updated_by, " +
            "p.is_deleted, p.category_id, p.type_id, p.catalog, p.series, p.date_public, p.status, " +
            "p.publisher_id, p.distributor_id " +
            "FROM product p ORDER BY p.stock ASC", nativeQuery = true)
    List<ProductEntity> getListProductRunningOut();

    @Modifying
    @Transactional
    @Query(value = "delete from order_detail where order_id = :orderId", nativeQuery = true)
    void deleteOrderDetail(@Param("orderId") Integer orderId);
}