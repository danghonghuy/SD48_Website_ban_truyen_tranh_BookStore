package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.CouponEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<CouponEntity, Integer> {

    Optional<CouponEntity> findByCode(String code);

    @Query(value = "select MAX(id) from [dbo].[coupon]", nativeQuery = true)
    Integer getIdGenerateCode();

    @Query(value = "SELECT * FROM coupon d WHERE " +
            "(:startDate IS NULL OR d.date_start >= :startDate) AND " +
            "(:endDate IS NULL OR d.date_end <= :endDate) AND " +
            "(:minValue IS NULL OR d.min_value >= :minValue) AND " +
            "(:maxValue IS NULL OR d.max_value <= :maxValue) AND " +
            "(:keySearch IS NULL OR LEN(:keySearch) = 0 OR d.code LIKE CONCAT('%',:keySearch,'%') OR d.name LIKE CONCAT('%',:keySearch,'%')) AND " +
            "(:status IS NULL OR d.status = :status) AND " +
            "(d.quantity_used < d.quantity)",
            countQuery = "SELECT COUNT(*) FROM coupon d WHERE " +
                    "(:startDate IS NULL OR d.date_start >= :startDate) AND " +
                    "(:endDate IS NULL OR d.date_end <= :endDate) AND " +
                    "(:minValue IS NULL OR d.min_value >= :minValue) AND " +
                    "(:maxValue IS NULL OR d.max_value <= :maxValue) AND " +
                    "(:keySearch IS NULL OR LEN(:keySearch) = 0 OR d.code LIKE CONCAT('%',:keySearch,'%') OR d.name LIKE CONCAT('%',:keySearch,'%')) AND " +
                    "(:status IS NULL OR d.status = :status) AND " +
                    "(d.quantity_used < d.quantity)",
            nativeQuery = true)
    Page<CouponEntity> getListCoupon(
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
    @Query(value = "update c set c.quantity_used = (c.quantity_used + 1), c.updated_date = GETDATE() from orders od inner join coupon c on od.coupon_id = c.id" +
            " where od.id = :orderId AND c.quantity_used < c.quantity", nativeQuery = true)
    void updateQuantity(@Param("orderId") Integer orderId);

    @Modifying
    @Transactional
    @Query(value = "update coupon set [status] = :newStatus, updated_date = GETDATE() where id = :id", nativeQuery = true)
    void updateDeleteCoupon(@Param("id") Integer id, @Param("newStatus") Integer newStatus);

    @Modifying
    @Transactional
    @Query(value = "UPDATE coupon SET status = :newStatus, updated_date = GETDATE() " +
            "WHERE date_end < GETDATE() AND status != :newStatus", nativeQuery = true)
    void resetCouponProgram(@Param("newStatus") Integer newStatus);

    @Modifying
    @Transactional
    @Query(value = "UPDATE coupon SET status = :newStatus, updated_date = GETDATE() " +
            "WHERE date_start > GETDATE() AND status != :newStatus AND quantity_used < quantity", nativeQuery = true)
    void imminentCouponProgram(@Param("newStatus") Integer newStatus);

    @Modifying
    @Transactional
    @Query(value = "UPDATE coupon SET status = :newStatus, updated_date = GETDATE() " +
            "WHERE GETDATE() BETWEEN date_start AND date_end AND status != :newStatus AND quantity_used < quantity", nativeQuery = true)
    void activeCouponProgram(@Param("newStatus") Integer newStatus);
}