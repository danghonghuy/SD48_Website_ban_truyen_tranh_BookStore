package com.example.backend_comic_service.develop.repository;

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
public interface CategoryRepository extends JpaRepository<CategoryEntity, Integer> {

    @Query(value = "select * from category c where (len(isnull(?1 , '')) <= 0 or c.code like ?1 +'%' or c.[name] like ?1 +'%') " +
            "   and (isnull(?2, c.[status]) < 0 or c.status = isnull(?2, c.[status]))  order by c.id desc", nativeQuery = true)
    Page<CategoryEntity> getListCategory(String keySearch, Integer status, Pageable pageable);
    Optional<CategoryEntity> getCategoryEntitiesById(Integer id);
    Optional<CategoryEntity> getCategoryEntitiesByName(String name);
    List<CategoryEntity> getCategoryEntitiesByCode(String code);
    @Query(value = "select MAX(id) from [dbo].[category]", nativeQuery = true)
    Integer getIdGenerateCode();
    @Modifying
    @Transactional
    @Query(value = "update category set [status] = ?2 where id = ?1", nativeQuery = true)
    void updateCategory(Integer categoryId, Integer status);

    @Query(value = "select * from category WHERE LOWER(name) like LOWER(N'%' + ?1 +'%')", nativeQuery = true)
    CategoryEntity findByName(String name);

}
