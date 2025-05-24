package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.CategoryEntity;
import jakarta.transaction.Transactional; // Giữ nguyên nếu bạn dùng jakarta.transaction
// import org.springframework.transaction.annotation.Transactional; // Hoặc dùng cái này của Spring nếu các @Modifying khác đang dùng
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Nên dùng @Param cho rõ ràng
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Integer> {

    @Query(value = "SELECT * FROM category c WHERE " +
            " (LEN(ISNULL(:keySearch, '')) <= 0 OR c.code LIKE CONCAT('%', :keySearch, '%') OR c.[name] LIKE CONCAT('%', :keySearch, '%')) " +
            " AND (:status IS NULL OR c.status = :status)", // <--- ĐÃ XÓA "order by c.id desc"
            countQuery = "SELECT count(*) FROM category c WHERE " + // <--- THÊM countQuery
                    " (LEN(ISNULL(:keySearch, '')) <= 0 OR c.code LIKE CONCAT('%', :keySearch, '%') OR c.[name] LIKE CONCAT('%', :keySearch, '%')) " +
                    " AND (:status IS NULL OR c.status = :status)",
            nativeQuery = true)
    Page<CategoryEntity> getListCategory(@Param("keySearch") String keySearch,
                                         @Param("status") Integer status,
                                         Pageable pageable); // Pageable sẽ cung cấp thông tin Sort

    Optional<CategoryEntity> getCategoryEntitiesById(Integer id);
    Optional<CategoryEntity> getCategoryEntitiesByName(String name); // Cân nhắc đổi tên thành findByName nếu chỉ trả về 1 Optional
    List<CategoryEntity> getCategoryEntitiesByCode(String code); // Cân nhắc đổi tên thành findByCode nếu trả về List

    @Query(value = "select MAX(id) from [dbo].[category]", nativeQuery = true)
    Integer getIdGenerateCode();

    @Modifying
    @Transactional // Đảm bảo import đúng (jakarta hoặc org.springframework)
    @Query(value = "update category set [status] = :newStatus where id = :categoryId", nativeQuery = true)
    void updateCategory(@Param("categoryId") Integer categoryId, @Param("newStatus") Integer newStatus);

    // Phương thức này có vẻ trả về một Entity, nhưng tên là findByName, thường findOneByName sẽ rõ hơn
    // Hoặc nếu muốn tìm nhiều thì trả về List<CategoryEntity>
    @Query(value = "select * from category WHERE LOWER(name) like LOWER(CONCAT('%', :name,'%'))", nativeQuery = true)
    CategoryEntity findByName(@Param("name") String name); // Nếu có thể trả về null hoặc nhiều hơn 1, nên dùng Optional<CategoryEntity> hoặc List<CategoryEntity>

}