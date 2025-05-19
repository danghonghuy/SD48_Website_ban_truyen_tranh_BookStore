package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.ImageEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<ImageEntity, Integer> {

    @Modifying
    @Transactional
    @Query(value = "update images set is_deleted = ?2  where id = ?1", nativeQuery = true)
    int updateImages(Integer id, Integer status);
}
