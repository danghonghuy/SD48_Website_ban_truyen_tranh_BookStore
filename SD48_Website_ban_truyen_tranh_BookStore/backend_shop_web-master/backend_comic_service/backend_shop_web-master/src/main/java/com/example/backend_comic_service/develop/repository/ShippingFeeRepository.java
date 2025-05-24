package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.ShippingFee;
import com.example.backend_comic_service.develop.enums.StatusFeeEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingFeeRepository extends JpaRepository<ShippingFee, Long>  {
    Boolean existsByPointDestination(String codeDestination);
    Boolean existsByPointDestinationAndPointSource(String codeDestination, String codeSource);

    Boolean existsByPointSource(String codeSource);

    @Query(value = "SELECT * FROM [shipping_fee] p WHERE " +
            " (LEN(ISNULL(:keySearch, '')) = 0 OR p.[point_source] LIKE CONCAT('%', :keySearch, '%') " +
            "  OR p.[point_destination] LIKE CONCAT('%', :keySearch, '%') " +
            "  OR CAST(p.[fee] AS VARCHAR(255)) LIKE CONCAT('%', :keySearch, '%')) " + // Assuming fee might be numeric and needs casting for LIKE
            " AND (:status IS NULL OR p.[status] = :status)",
            countQuery = "SELECT count(*) FROM [shipping_fee] p WHERE " +
                    " (LEN(ISNULL(:keySearch, '')) = 0 OR p.[point_source] LIKE CONCAT('%', :keySearch, '%') " +
                    "  OR p.[point_destination] LIKE CONCAT('%', :keySearch, '%') " +
                    "  OR CAST(p.[fee] AS VARCHAR(255)) LIKE CONCAT('%', :keySearch, '%')) " +
                    " AND (:status IS NULL OR p.[status] = :status)",
            nativeQuery = true)
    Page<ShippingFee> getListShippingFee(@Param("keySearch") String keySearch,
                                         @Param("status") StatusFeeEnum status, // Pass Enum directly
                                         Pageable pageable);

    ShippingFee findByPointSourceAndPointDestinationAndStatus(String codeSource, String codeDestination, StatusFeeEnum status);
}