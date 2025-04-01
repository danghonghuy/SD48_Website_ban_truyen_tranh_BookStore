package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.CouponEntity;
import com.example.backend_comic_service.develop.entity.DiscountEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<CouponEntity, Integer> {
    Optional<CouponEntity> findByCode(String code);
    Optional<CouponEntity> findById(int id);
    @Query(value = "select MAX(id) from [dbo].[coupon]", nativeQuery = true)
    Integer getIdGenerateCode();
//    @Query(value = "select * from coupon d where (d.[date_start] >= isnull(?1, d.[date_start]) and d.[date_end] <= isnull(?2, d.[date_end]))\n" +
//            "                               and (d.min_value >= isnull(?3, d.min_value) and d.max_value <= isnull(?4, d.max_value))\n" +
//            "   and (len(isnull(?5, '')) <= 0 or d.code like ?5 + '%' or d.[name] like ?5 + '%')\n" +
//            "   and  d.[status] = isnull(?6, d.[status]) \n" +
//            "   order by d.id desc", nativeQuery = true)
    @Query(value = "select * from coupon d order by d.id desc", nativeQuery = true)
    Page<CouponEntity> getListCoupon(Date startDate, Date endDate, Integer minValue, Integer maxValue, String keySearch, Integer status, Pageable pageable);
    @Modifying
    @Transactional
    @Query(value = "update c set c.quantity_used = (c.quantity_used + 1) from orders od inner join coupon c on od.coupon_id = c.id \n" +
            " where od.id = ?1", nativeQuery = true)
    void updateQuantity(Integer orderId);
    @Modifying
    @Transactional
    @Query(value = "update coupon set [status] = ?2 where id = ?1", nativeQuery = true)
    void updateDeleteCoupon(Integer id, Integer status);
    @Query(value = "update d set d.[status]  = 1 from coupon d where d.date_end < GETDATE()", nativeQuery = true)
    void resetCouponProgram(Integer status);
}
