package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.CatalogEntity;
import com.example.backend_comic_service.develop.entity.CategoryEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatalogRepository extends JpaRepository<CatalogEntity, Integer> {
    @Query(value = "select * from catalog c where (len(isnull(?1 , '')) <= 0 or c.code like ?1 +'%' or c.[name] like ?1 +'%') " +
            "   and (isnull(?2, c.[status]) < 0 or isnull(?2, c.[status]) = c.status) order by c.id desc", nativeQuery = true)
    Page<CatalogEntity> getList(String keySearch, Integer status, Pageable pageable);
    Optional<CatalogEntity> getCatalogEntityById(Integer id);
    Optional<CatalogEntity> getCategoryEntitiesByName(String name);
    List<CatalogEntity> getByCode(String code);
    @Query(value = "select MAX(id) from [dbo].[catalog]", nativeQuery = true)
    Integer getIdGenerateCode();
    @Modifying
    @Transactional
    @Query(value = "update catalog set [status] = ?2 where id = ?1", nativeQuery = true)
    void updateCategory(Integer categoryId, Integer status);
}
