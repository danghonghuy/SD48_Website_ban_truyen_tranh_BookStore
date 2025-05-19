package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.ProductEntity;
import com.example.backend_comic_service.develop.entity.TypeEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TypeRepository extends JpaRepository<TypeEntity, Integer> {
    Optional<TypeEntity> findByCode(String code);
    @Query(value = "select MAX(id) from [dbo].[types]", nativeQuery = true)
    Integer getIdGenerateCode();
    @Query(value = "select * from [types] t where (len(isnull(?1, '')) <= 0 or t.code like ?1 + '%' or t.[name] like ?1 + '%')\n" +
            "                              and (isnull(?2, t.[status]) < 0 or t.[status] = isnull(?2, t.[status]))\n" +
            "  order by id desc", nativeQuery = true)
    Page<TypeEntity> getListType(String keySearch, Integer status, Pageable pageable);
    Optional<TypeEntity> findById(Integer id);
    @Modifying
    @Transactional
    @Query(value = "update [dbo].[types] set [status] = 0 , is_deleted = 1 where id = ?1", nativeQuery = true)
    void updateStatus(Integer id);

    @Query(value = "select * from types WHERE LOWER(name) like LOWER(N'%' + ?1 +'%')", nativeQuery = true)
    TypeEntity findByName (String name);
}
