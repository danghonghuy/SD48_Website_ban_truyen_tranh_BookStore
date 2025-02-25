package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.PaymentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Integer> {
    Optional<PaymentEntity> findById(Integer id);
    @Query(value = "select MAX(id) from [dbo].[payments]", nativeQuery = true)
    Integer getIdGenerateCode();
    @Query(value = "select * from payments p where (len(isnull(?1, '')) <= 0 or p.code like ?1 + '%' or p.[name] like ?1 + '%') order by p.id desc", nativeQuery = true)
    Page<PaymentEntity> getListPayments(String keySearch, Pageable pageable);
    @Query(value = "update payments set [status] = 0 , is_deleted = 1 where id = ?1", nativeQuery = true)
    void updatePayment(Integer id);
}
