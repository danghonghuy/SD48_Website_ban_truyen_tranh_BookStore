package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    @Query(value = "select MAX(id) from [dbo].[users]", nativeQuery = true)
    Integer generateUserCode();
    List<UserEntity> getUserEntitiesByUserName(String userName);
    List<UserEntity> getUserEntitiesByEmail(String email);
    List<UserEntity> getUserEntitiesByPhoneNumber(String phoneNumber);
    Optional<UserEntity> findUserEntitiesByUserName(String userName);
    boolean existsByUserName(String userName);
    Optional<UserEntity> findUserEntitiesById(Integer id);
    Integer deleteUserEntitiesById(Integer id);
    @Query(value = "select * from users u where ( (LEN(isnull(?1 , '')) <= 0 or u.code like ?1 + '%' or u.[full_name] like  ?1 + '%' or u.[email] like ?1 + '%' or u.[phone_number] like  ?1 + '%') and u.[status] = isnull(?2, u.[status])) order by u.id desc", nativeQuery = true)
    Page<UserEntity> getListUser(String keySearch, Integer status, Pageable pageable);
}
