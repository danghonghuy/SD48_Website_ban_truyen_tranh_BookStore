package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.DeliveryEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<DeliveryEntity, Integer> {
    Optional<DeliveryEntity> findById(Integer id);

    @Query(value = "select MAX(id) from [dbo].[delivery]", nativeQuery = true)
    Integer getIdGenerateCode();

    @Query(value = "SELECT * FROM delivery p WHERE " +
            " (LEN(ISNULL(:keySearch, '')) = 0 OR p.code LIKE CONCAT(:keySearch, '%') OR p.[name] LIKE CONCAT(:keySearch, '%')) " +
            " AND (:status IS NULL OR p.status = :status)",
            countQuery = "SELECT count(*) FROM delivery p WHERE " +
                    " (LEN(ISNULL(:keySearch, '')) = 0 OR p.code LIKE CONCAT(:keySearch, '%') OR p.[name] LIKE CONCAT(:keySearch, '%')) " +
                    " AND (:status IS NULL OR p.status = :status)",
            nativeQuery = true)
    Page<DeliveryEntity> getList(@Param("keySearch") String keySearch,
                                 @Param("status") Integer status,
                                 Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "update delivery set [status] = :newStatus  where id = :id", nativeQuery = true)
    int updateDelivery(@Param("id") Integer id, @Param("newStatus") Integer status);
}