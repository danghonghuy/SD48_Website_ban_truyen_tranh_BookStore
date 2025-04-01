package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.AddressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface AddressRepository extends JpaRepository<AddressEntity, Integer> {
    Optional<AddressEntity> findById(Integer id);
    @Query(value = "delete from address where id in (?1)", nativeQuery = true)
    void bulkDelete(List<Integer> ids);
    @Query(value = "select top 1 * from [address] where [user_id] = ?1", nativeQuery = true)
    Optional<AddressEntity> getTop1ByUserId(Integer userId);
    @Query(value = "select * from [address] where [user_id] = ?1", nativeQuery = true)
    Set<AddressEntity> getByUserId(Integer userId);
}
