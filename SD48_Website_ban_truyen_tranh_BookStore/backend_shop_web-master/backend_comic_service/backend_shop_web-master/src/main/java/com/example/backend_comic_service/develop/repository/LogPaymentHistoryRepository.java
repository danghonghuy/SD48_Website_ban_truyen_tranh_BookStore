package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.LogPaymentHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LogPaymentHistoryRepository extends JpaRepository<LogPaymentHistoryEntity, Integer> {

    @Query(value = "select * from log_payment_history where order_id = ?1", nativeQuery = true)
    LogPaymentHistoryEntity findByOrderId(Integer id);
}
