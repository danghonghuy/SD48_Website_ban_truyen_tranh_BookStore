package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.DistrictEntity;
import com.example.backend_comic_service.develop.entity.ProvincesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistrictRepository extends JpaRepository<DistrictEntity, Integer> {

    @Query(value = "select * from districts d where (isnull(?1, '') = '' or d.[name] like ?1 + '%') and d.province_code = ?2 order by d.code desc\n", nativeQuery = true)
    List<DistrictEntity> getListDistrict(String name, String provinceCode);
    @Query(value = "select * from districts where code in (?1)", nativeQuery = true)
    List<DistrictEntity> getListById(List<String> code);
}
