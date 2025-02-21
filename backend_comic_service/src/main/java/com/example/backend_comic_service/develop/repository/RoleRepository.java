package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.RoleEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    List<RoleEntity> findRoleEntitiesByCode(String code);
    Optional<RoleEntity> findRoleEntitiesById(Long id);
    @Query(value = "select * from [dbo].[role] as r where (len(isnull(?1, '')) <= 0 or r.code like ?1 + '%') \n" +
            "                                   and (len(isnull(?2, '')) <= 0 or r.name like ?2 + '%') \n" +
            "   and r.[status] = 1\n" +
            "   and r.[is_delete] = 0 order by r.id desc ", nativeQuery = true)
    Page<RoleEntity> findListRoleEntities(String code, String name, Pageable pageable);
}
