package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.TypeEntity;
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
public interface TypeRepository extends JpaRepository<TypeEntity, Integer> {
    Optional<TypeEntity> findByCode(String code);

    @Query(value = "select MAX(id) from [dbo].[types]", nativeQuery = true)
    Integer getIdGenerateCode();

    @Query(value = "SELECT * FROM [types] t WHERE " +
            " (LEN(ISNULL(:keySearch, '')) = 0 OR t.code LIKE CONCAT(:keySearch, '%') OR t.[name] LIKE CONCAT(:keySearch, '%')) " +
            " AND (:status IS NULL OR :status < 0 OR t.[status] = :status)",
            countQuery = "SELECT count(*) FROM [types] t WHERE " +
                    " (LEN(ISNULL(:keySearch, '')) = 0 OR t.code LIKE CONCAT(:keySearch, '%') OR t.[name] LIKE CONCAT(:keySearch, '%')) " +
                    " AND (:status IS NULL OR :status < 0 OR t.[status] = :status)",
            nativeQuery = true)
    Page<TypeEntity> getListType(@Param("keySearch") String keySearch,
                                 @Param("status") Integer status,
                                 Pageable pageable);

    Optional<TypeEntity> findById(Integer id); // JpaRepository đã có sẵn phương thức này

    @Modifying
    @Transactional
    @Query(value = "update [dbo].[types] set [status] = 0 , is_deleted = 1 where id = :id", nativeQuery = true)
    void updateStatus(@Param("id") Integer id);

    @Query(value = "select * from types WHERE LOWER(name) like LOWER(CONCAT('%', :name,'%'))", nativeQuery = true)
    TypeEntity findByName(@Param("name") String name);
}