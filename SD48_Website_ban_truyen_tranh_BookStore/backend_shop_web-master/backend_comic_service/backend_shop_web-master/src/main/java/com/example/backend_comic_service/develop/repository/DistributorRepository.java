package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.DistributorEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DistributorRepository extends JpaRepository<DistributorEntity, Integer> {

    @Query("SELECT d FROM DistributorEntity d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :keySearch, '%'))")
    Page<DistributorEntity> findByNameContainingIgnoreCase(@Param("keySearch") String keySearch, Pageable pageable);

    Page<DistributorEntity> findAll(Pageable pageable);

    boolean existsByNameIgnoreCase(String name);
}