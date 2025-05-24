package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.PaymentEntity;
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
public interface PaymentRepository extends JpaRepository<PaymentEntity, Integer> {
    Optional<PaymentEntity> findById(Integer id); // JpaRepository đã có sẵn phương thức này

    @Query(value = "select MAX(id) from [dbo].[payments]", nativeQuery = true)
    Integer getIdGenerateCode();

    @Query(value = "SELECT * FROM payments p WHERE " +
            " (LEN(ISNULL(:keySearch, '')) = 0 OR p.code LIKE CONCAT(:keySearch, '%') OR p.[name] LIKE CONCAT(:keySearch, '%')) " +
            " AND (:status IS NULL OR p.[status] = :status)",
            countQuery = "SELECT count(*) FROM payments p WHERE " +
                    " (LEN(ISNULL(:keySearch, '')) = 0 OR p.code LIKE CONCAT(:keySearch, '%') OR p.[name] LIKE CONCAT(:keySearch, '%')) " +
                    " AND (:status IS NULL OR p.[status] = :status)",
            nativeQuery = true)
    Page<PaymentEntity> getListPayments(@Param("keySearch") String keySearch,
                                        @Param("status") Integer status,
                                        Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "update payments set [status] = :newStatus where id = :id", nativeQuery = true)
    void updatePayment(@Param("id") Integer id, @Param("newStatus") Integer status);
}