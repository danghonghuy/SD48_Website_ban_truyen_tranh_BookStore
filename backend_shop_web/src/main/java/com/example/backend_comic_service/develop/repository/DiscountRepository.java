package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.DiscountEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<DiscountEntity, Integer> {

    Optional<DiscountEntity> findById(int id);

    Optional<DiscountEntity> findByCode(String code);

    @Query(value = "select MAX(id) from [dbo].[discount]", nativeQuery = true)
    Integer getIdGenerateCode();

    @Query(value = "select * from discount d where (d.[start_date] >= isnull(?1, d.[start_date]) and d.[end_date] <= isnull(?2, d.[end_date])) and (len(isnull(?3, '')) <= 0 or d.code like ?3 + '%' or d.[name] like ?3 + '%')  and d.[status] = isnull(?4, d.[status])", nativeQuery = true)
    Page<DiscountEntity> getListDiscount(LocalDateTime startDate, LocalDateTime endDate, String keySearch, Integer status, Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "update discount set [status] = ?2 where id = ?1", nativeQuery = true)
    void updateDeleteDiscount(Integer id, Integer status);

    @Modifying
    @Transactional
    @Query(value = "update d set d.status = ?1 from discount d where d.end_date < GETDATE()", nativeQuery = true)
    void resetDiscountProgram(Integer status);

    @Modifying
    @Transactional
    @Query(value = "update d set d.status = ?1 from discount d where d.start_date > GETDATE()", nativeQuery = true)
    void imminentDiscountProgram(Integer status);

    @Modifying
    @Transactional
    @Query(value = "update d set d.status = ?1 from discount d where GETDATE() between d.start_date and d.end_date", nativeQuery = true)
    void activeDiscountProgram(Integer status);

    @Modifying
    @Transactional
    @Query(value = "delete from product_discount where discount_id = ?1", nativeQuery = true)
    void deleteProductWithDiscountId(Integer id);


    @Query(value = "select d.* from discount d inner join product_discount pd\n" +
            "    on d.id = pd.discount_id\n" +
            "and pd.product_id = ?1 and d.status = 1 order by d.[percent] desc", nativeQuery = true)
    List<DiscountEntity> getDiscountEntitiesByProductId(Integer id);
}
