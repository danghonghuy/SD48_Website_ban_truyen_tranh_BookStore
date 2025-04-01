package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.LogActionOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LogActionOrderRepository extends JpaRepository<LogActionOrderEntity, Integer> {
    @Query(value = "select * from [dbo].[log_action_order] where order_id = ?1", nativeQuery = true)
    List<LogActionOrderEntity> findByOrderId(Integer orderId);
}
