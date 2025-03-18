package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.ProvincesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProvinceRepository extends JpaRepository<ProvincesEntity, Integer> {
    @Query(value = "select * from provinces p where isnull(?1, '') = '' or p.[name] like ?1 + '%' order by p.code desc", nativeQuery = true)
    List<ProvincesEntity> getListProvinces(String name);
}
