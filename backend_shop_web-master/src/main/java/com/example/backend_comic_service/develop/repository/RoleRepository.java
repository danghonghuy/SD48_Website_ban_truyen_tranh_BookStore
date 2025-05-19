package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.RoleEntity;
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
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    List<RoleEntity> findRoleEntitiesByCode(String code);
    Optional<RoleEntity> findRoleEntitiesById(Long id);
    @Query(value = "select * from [dbo].[role] as r where (len(isnull(?1, '')) <= 0 or r.code like ?1 + '%' or r.name like ?1 + '%') and r.status = isnull(?2, r.status)\n" +
            " order by r.id desc ", nativeQuery = true)
    Page<RoleEntity> findListRoleEntities(String keySearch, Integer status, Pageable pageable);
    @Modifying
    @Transactional
    @Query(value = "update [dbo].[role] set [status] = ?2 where id = ?1", nativeQuery = true)
    void updateStatus(Integer id, Integer status);
}
