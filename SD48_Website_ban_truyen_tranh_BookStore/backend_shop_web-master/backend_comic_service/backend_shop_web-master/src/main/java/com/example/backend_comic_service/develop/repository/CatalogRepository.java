package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.CatalogEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatalogRepository extends JpaRepository<CatalogEntity, Integer> {

    @Query(value = "SELECT * FROM catalog c WHERE " +
            " (LEN(ISNULL(:keySearch, '')) = 0 OR c.code LIKE CONCAT(:keySearch, '%') OR c.[name] LIKE CONCAT(:keySearch, '%')) " +
            " AND (:status IS NULL OR :status < 0 OR c.status = :status)",
            countQuery = "SELECT count(*) FROM catalog c WHERE " +
                    " (LEN(ISNULL(:keySearch, '')) = 0 OR c.code LIKE CONCAT(:keySearch, '%') OR c.[name] LIKE CONCAT(:keySearch, '%')) " +
                    " AND (:status IS NULL OR :status < 0 OR c.status = :status)",
            nativeQuery = true)
    Page<CatalogEntity> getList(@Param("keySearch") String keySearch,
                                @Param("status") Integer status,
                                Pageable pageable);

    Optional<CatalogEntity> getCatalogEntityById(Integer id);

    Optional<CatalogEntity> getCategoryEntitiesByName(String name);

    List<CatalogEntity> getByCode(String code);

    @Query(value = "select MAX(id) from [dbo].[catalog]", nativeQuery = true)
    Integer getIdGenerateCode();

    @Modifying
    @Transactional
    @Query(value = "update catalog set [status] = :newStatus where id = :catalogId", nativeQuery = true)
    void updateCategory(@Param("catalogId") Integer catalogId, @Param("newStatus") Integer status);

    @Query(value = "select * from catalog WHERE LOWER(name) like LOWER(CONCAT('%', :name,'%'))", nativeQuery = true)
    CatalogEntity findByName(@Param("name") String name);
}