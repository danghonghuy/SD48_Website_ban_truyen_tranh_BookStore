package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.AddressEntity;
import com.example.backend_comic_service.develop.entity.DistrictEntity; // THÊM IMPORT
import com.example.backend_comic_service.develop.entity.ProvincesEntity; // THÊM IMPORT
import com.example.backend_comic_service.develop.entity.WardEntity;     // THÊM IMPORT
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // THÊM IMPORT
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface AddressRepository extends JpaRepository<AddressEntity, Integer> {
    Optional<AddressEntity> findById(Integer id); // Phương thức này đã có, tốt

    // @Query(value = "delete from address where id in (?1)", nativeQuery = true) // Câu query này có thể gây lỗi nếu ?1 là list
    // Nên dùng cách của Spring Data JPA để xóa theo list ID nếu có thể, hoặc sửa lại native query
    @Modifying // Thêm @Modifying cho các câu lệnh DML
    @Transactional // Thêm @Transactional
    @Query(value = "DELETE FROM address WHERE id IN (:ids)", nativeQuery = true) // Sửa lại placeholder
    void bulkDelete(@Param("ids") List<Integer> ids); // Đặt tên param cho rõ ràng

    @Query(value = "select top 1 * from [address] where [user_id] = :userId order by is_default desc, created_date desc", nativeQuery = true) // Thêm order by để lấy địa chỉ "tốt nhất"
    Optional<AddressEntity> getTop1ByUserId(@Param("userId") Integer userId);

    @Query(value = "select * from [address] where [user_id] = :userId", nativeQuery = true)
    Set<AddressEntity> getByUserId(@Param("userId") Integer userId);

    @Transactional
    @Modifying
    @Query(value = "delete from address where user_id = :userId", nativeQuery = true)
    void bulkDeleteByUserId(@Param("userId") Integer userId);

    @Query(value = "select * from address where user_id = :userId", nativeQuery = true) // Có thể trả về List hoặc Set, hoặc Optional nếu chỉ mong 1
    List<AddressEntity> getAddressEntitiesByUserId(@Param("userId") Integer userId); // Đổi tên cho rõ ràng hơn getAddressEntity

    // --- CÁC PHƯƠNG THỨC MỚI CẦN THÊM ĐỂ LẤY TỈNH/HUYỆN/XÃ ---
    @Query("SELECT p FROM ProvincesEntity p WHERE p.code = :code")
    Optional<ProvincesEntity> findProvinceByCode(@Param("code") String code);

    @Query("SELECT d FROM DistrictEntity d WHERE d.code = :code")
    Optional<DistrictEntity> findDistrictByCode(@Param("code") String code);

    @Query("SELECT w FROM WardEntity w WHERE w.code = :code")
    Optional<WardEntity> findWardByCode(@Param("code") String code);
}