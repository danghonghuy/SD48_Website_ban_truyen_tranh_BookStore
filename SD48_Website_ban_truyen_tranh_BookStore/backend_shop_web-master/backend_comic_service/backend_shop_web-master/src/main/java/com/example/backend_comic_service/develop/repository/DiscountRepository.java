package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.DiscountEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<DiscountEntity, Integer> {

    Optional<DiscountEntity> findById(int id);

    Optional<DiscountEntity> findByCode(String code);

    @Query(value = "select MAX(id) from [dbo].[discount]", nativeQuery = true)
    Integer getIdGenerateCode();

    @Query(value = "SELECT * FROM discount d WHERE " +
            "(:startDate IS NULL OR d.[start_date] >= :startDate) AND " +
            "(:endDate IS NULL OR d.[end_date] <= :endDate) AND " +
            "(:minValue IS NULL OR d.[money_discount] >= :minValue) AND " +
            "(:maxValue IS NULL OR d.[money_discount] <= :maxValue) AND " +
            "(:keySearch IS NULL OR LEN(:keySearch) = 0 OR d.code LIKE CONCAT('%', :keySearch, '%') OR d.[name] LIKE CONCAT('%', :keySearch, '%')) AND " +
            "(:status IS NULL OR d.[status] = :status)",
            countQuery = "SELECT COUNT(*) FROM discount d WHERE " +
                    "(:startDate IS NULL OR d.[start_date] >= :startDate) AND " +
                    "(:endDate IS NULL OR d.[end_date] <= :endDate) AND " +
                    "(:minValue IS NULL OR d.[money_discount] >= :minValue) AND " +
                    "(:maxValue IS NULL OR d.[money_discount] <= :maxValue) AND " +
                    "(:keySearch IS NULL OR LEN(:keySearch) = 0 OR d.code LIKE CONCAT('%', :keySearch, '%') OR d.[name] LIKE CONCAT('%', :keySearch, '%')) AND " +
                    "(:status IS NULL OR d.[status] = :status)",
            nativeQuery = true)
    Page<DiscountEntity> getListDiscount(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("minValue") Integer minValue,
            @Param("maxValue") Integer maxValue,
            @Param("keySearch") String keySearch,
            @Param("status") Integer status,
            Pageable pageable
    );

    @Modifying
    @Transactional
    @Query(value = "update discount set [status] = :newStatus where id = :id", nativeQuery = true)
    void updateDeleteDiscount(@Param("id") Integer id, @Param("newStatus") Integer status);

    @Modifying
    @Transactional
    @Query(value = "update d set d.status = :newStatus from discount d where d.end_date < GETDATE()", nativeQuery = true)
    void resetDiscountProgram(@Param("newStatus") Integer status);

    @Modifying
    @Transactional
    @Query(value = "update d set d.status = :newStatus from discount d where d.start_date > GETDATE()", nativeQuery = true)
    void imminentDiscountProgram(@Param("newStatus") Integer status);

    @Modifying
    @Transactional
    @Query(value = "update d set d.status = :newStatus from discount d where GETDATE() between d.start_date and d.end_date", nativeQuery = true)
    void activeDiscountProgram(@Param("newStatus") Integer status);

    @Modifying
    @Transactional
    @Query(value = "delete from product_discount where discount_id = :discountId", nativeQuery = true)
    void deleteProductWithDiscountId(@Param("discountId") Integer id);


    @Query(value = "select d.* from discount d inner join product_discount pd " +
            "on d.id = pd.discount_id " +
            "where pd.product_id = :productId and d.status = 1 order by d.[percent] desc", nativeQuery = true)
    List<DiscountEntity> getDiscountEntitiesByProductId(@Param("productId") Integer id);

    // Thêm phương thức này để sử dụng trong ProductServiceImpl (hoặc service tương đương)
    // để lấy các khuyến mãi đang hoạt động cho một sản phẩm tại một thời điểm cụ thể.
    @Query("SELECT d FROM DiscountEntity d JOIN d.productDiscountEntities pde " +
            "WHERE pde.product.id = :productId " +
            "AND d.status = 1 " +
            "AND :currentTime BETWEEN d.startDate AND d.endDate")
    List<DiscountEntity> findActiveDiscountsForProductAtTime(
            @Param("productId") Integer productId,
            @Param("currentTime") LocalDateTime currentTime
    );
}