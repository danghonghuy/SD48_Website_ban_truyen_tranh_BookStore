package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.DeliveryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<DeliveryEntity, Integer> {
    Optional<DeliveryEntity> findById(int id);
}
