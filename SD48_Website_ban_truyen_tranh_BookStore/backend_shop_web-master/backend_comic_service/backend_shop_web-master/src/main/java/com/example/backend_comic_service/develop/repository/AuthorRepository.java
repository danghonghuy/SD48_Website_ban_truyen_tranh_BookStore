package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.AuthorEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List; // Thêm import này
import java.util.Collection; // Hoặc import này nếu bạn muốn dùng Collection chung hơn

@Repository
public interface AuthorRepository extends JpaRepository<AuthorEntity, Integer> {

    @Query("SELECT a FROM AuthorEntity a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :keySearch, '%'))")
    Page<AuthorEntity> findByNameContainingIgnoreCase(@Param("keySearch") String keySearch, Pageable pageable);

    Page<AuthorEntity> findAll(Pageable pageable);

    boolean existsByNameIgnoreCase(String name);

    // --- PHƯƠNG THỨC CÒN THIẾU ---
    List<AuthorEntity> findByIdIn(Collection<Integer> ids);
    // Hoặc bạn có thể dùng List<Integer> trực tiếp nếu luôn truyền vào List:
    // List<AuthorEntity> findByIdIn(List<Integer> ids);
    // -----------------------------
}