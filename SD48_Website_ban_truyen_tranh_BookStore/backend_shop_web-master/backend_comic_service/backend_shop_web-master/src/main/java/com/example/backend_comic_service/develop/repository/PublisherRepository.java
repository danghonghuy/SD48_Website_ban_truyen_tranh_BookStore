package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.PublisherEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PublisherRepository extends JpaRepository<PublisherEntity, Integer> {

    @Query("SELECT p FROM PublisherEntity p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keySearch, '%'))")
    Page<PublisherEntity> findByNameContainingIgnoreCase(@Param("keySearch") String keySearch, Pageable pageable);

    Page<PublisherEntity> findAll(Pageable pageable);

    boolean existsByNameIgnoreCase(String name);
}