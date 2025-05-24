package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.UserEntity;
import jakarta.transaction.Transactional; // Giữ nguyên nếu bạn dùng jakarta.transaction
// import org.springframework.transaction.annotation.Transactional; // Hoặc dùng của Spring nếu các @Modifying khác đang dùng
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Import @Param
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> { // JpaRepository thường dùng ID của Entity làm kiểu thứ hai

    @Query(value = "select MAX(id) from [dbo].[users]", nativeQuery = true)
    Integer generateUserCode(); // Cân nhắc kiểu trả về Long nếu ID của UserEntity là Long

    List<UserEntity> getUserEntitiesByUserName(String userName);

    List<UserEntity> getUserEntitiesByEmail(String email);

    List<UserEntity> getUserEntitiesByPhoneNumber(String phoneNumber);

    Optional<UserEntity> findUserEntitiesByUserNameAndStatus(String userName, Integer status);

    boolean existsByUserName(String userName);

    Optional<UserEntity> findUserEntitiesById(Integer id); // Nếu ID của UserEntity là Long, nên dùng Long ở đây

    Integer deleteUserEntitiesById(Integer id); // Nếu ID của UserEntity là Long, nên dùng Long ở đây

    @Query(value = "SELECT * FROM users u WHERE " +
            " (LEN(ISNULL(:keySearch, '')) = 0 OR u.code LIKE CONCAT(:keySearch, '%') OR u.[full_name] LIKE CONCAT('%', :keySearch, '%') OR u.[email] LIKE CONCAT('%', :keySearch, '%') OR u.[phone_number] LIKE CONCAT('%', :keySearch, '%')) " +
            " AND (:status IS NULL OR u.[status] = :status) " +
            " AND (:roleIds IS NULL OR u.role_id IN (:roleIds)) " + // Sửa để xử lý List roleIds
            " AND (:gender IS NULL OR u.[gender] = :gender)",
            countQuery = "SELECT count(*) FROM users u WHERE " +
                    " (LEN(ISNULL(:keySearch, '')) = 0 OR u.code LIKE CONCAT(:keySearch, '%') OR u.[full_name] LIKE CONCAT('%', :keySearch, '%') OR u.[email] LIKE CONCAT('%', :keySearch, '%') OR u.[phone_number] LIKE CONCAT('%', :keySearch, '%')) " +
                    " AND (:status IS NULL OR u.[status] = :status) " +
                    " AND (:roleIds IS NULL OR u.role_id IN (:roleIds)) " +
                    " AND (:gender IS NULL OR u.[gender] = :gender)",
            nativeQuery = true)
    Page<UserEntity> getListUser(@Param("keySearch") String keySearch,
                                 @Param("status") Integer status,
                                 @Param("roleIds") List<Integer> roleIds, // Đổi tên tham số cho rõ ràng
                                 @Param("gender") Boolean gender,
                                 Pageable pageable);

    @Transactional // Đảm bảo import đúng
    @Modifying
    @Query(value = "delete from users where id = :userId", nativeQuery = true)
    void bulkDeleteByUserId(@Param("userId") Integer userId); // Nếu ID của UserEntity là Long, nên dùng Long

    UserEntity findByUserNameAndEmail(String username, String email);

    Optional<UserEntity> findByUserName(String userName);
}