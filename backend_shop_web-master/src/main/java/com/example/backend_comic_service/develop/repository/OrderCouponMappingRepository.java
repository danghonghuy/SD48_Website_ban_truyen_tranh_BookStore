package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.OrderCouponMappingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderCouponMappingRepository extends JpaRepository<OrderCouponMappingEntity, Integer> {
}
