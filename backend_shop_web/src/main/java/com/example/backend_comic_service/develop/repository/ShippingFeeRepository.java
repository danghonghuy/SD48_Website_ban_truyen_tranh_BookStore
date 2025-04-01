package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.ShippingFee;
import com.example.backend_comic_service.develop.entity.StatusFeeEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingFeeRepository extends JpaRepository<ShippingFee, Long>  {
    Boolean existsByPointDestination(String codeDestination);
    Boolean existsByPointDestinationAndPointSource(String codeDestination, String codeSource);

    Boolean existsByPointSource(String codeSource);

    @Query(value = "select * from [shipping_fee] p where (len(isnull(?1, '')) <= 0 or p.[point_source] like '%' + ?1 + '%' " +
            "or p.[point_destination] like '%' + ?1 + '%' " +
            "or p.[fee] like '%' + ?1 + '%') " +
            "and p.[status] = isnull(?2, p.[status])\n" +
            "order by p.fee_id desc", nativeQuery = true)
    Page<ShippingFee> getListShippingFee(String keySearch, StatusFeeEnum status, Pageable pageable);

    ShippingFee findByPointSourceAndPointDestinationAndStatus(String codeSource, String codeDestination, StatusFeeEnum status);
}
