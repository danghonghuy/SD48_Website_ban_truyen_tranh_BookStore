package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.WardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WardRepository extends JpaRepository<WardEntity, Integer> {

    @Query(value = "select * from wards d where (isnull(?1, '') = '' or d.[name] like ?1 + '%') and d.district_code = ?2 order by d.code desc", nativeQuery = true)
    List<WardEntity> getListWards(String name, String districtCode);

}
