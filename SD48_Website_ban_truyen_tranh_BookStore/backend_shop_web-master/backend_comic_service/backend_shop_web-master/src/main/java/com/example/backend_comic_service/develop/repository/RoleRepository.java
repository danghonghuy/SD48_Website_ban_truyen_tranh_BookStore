package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.RoleEntity;
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
public interface RoleRepository extends JpaRepository<RoleEntity, Long> { // ID của RoleEntity là Long
    List<RoleEntity> findRoleEntitiesByCode(String code);

    Optional<RoleEntity> findRoleEntitiesById(Long id); // JpaRepository đã có findById(ID id), có thể không cần ghi đè

    @Query(value = "SELECT * FROM [dbo].[role] as r WHERE " +
            " (LEN(ISNULL(:keySearch, '')) = 0 OR r.code LIKE CONCAT(:keySearch, '%') OR r.name LIKE CONCAT(:keySearch, '%')) " +
            " AND (:status IS NULL OR r.status = :status)",
            countQuery = "SELECT count(*) FROM [dbo].[role] as r WHERE " +
                    " (LEN(ISNULL(:keySearch, '')) = 0 OR r.code LIKE CONCAT(:keySearch, '%') OR r.name LIKE CONCAT(:keySearch, '%')) " +
                    " AND (:status IS NULL OR r.status = :status)",
            nativeQuery = true)
    Page<RoleEntity> findListRoleEntities(@Param("keySearch") String keySearch,
                                          @Param("status") Integer status,
                                          Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "update [dbo].[role] set [status] = :newStatus where id = :id", nativeQuery = true)
    void updateStatus(@Param("id") Long id, @Param("newStatus") Integer status); // ID của RoleEntity là Long
}