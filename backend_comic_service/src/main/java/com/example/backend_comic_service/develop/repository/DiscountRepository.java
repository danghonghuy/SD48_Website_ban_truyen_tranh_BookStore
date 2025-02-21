package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.DiscountEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<DiscountEntity, Integer> {
    
    Optional<DiscountEntity> findById(int id);
    Optional<DiscountEntity> findByCode(String code);
    @Query(value = "select MAX(id) from [dbo].[discount]", nativeQuery = true)
    Integer getIdGenerateCode();
    @Query(value = "select * from discount d where (d.[start_date] >= isnull(?1, d.[start_date]) and d.[end_date] <= isnull(?2, d.[end_date]))\n" +
            "                               and (d.min_value >= isnull(?3, d.min_value) and d.max_value <= isnull(?4, d.max_value))\n" +
            "   and (len(isnull(?5, '')) <= 0 or d.code like ?5 + '%' or d.[name] like ?5 + '%')\n" +
            "   and d.[status] = isnull(?6, d.[status])", nativeQuery = true)
    Page<DiscountEntity> getListDiscount(Date startDate, Date endDate, Integer minValue, Integer maxValue, String keySearch, Integer status, Pageable pageable);
}
