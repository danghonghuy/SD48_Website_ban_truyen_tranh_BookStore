package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.ProductDiscountEntity;
import com.example.backend_comic_service.develop.model.mapper.ProductDiscountMapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDiscountRepository extends JpaRepository<ProductDiscountEntity, Integer> {
    @Query(value = "select * from product_discount pd where pd.product_id in ?1 and pd.[status] = ?2", nativeQuery = true)
    List<ProductDiscountEntity> getProductDiscount(List<Integer> productIds, Integer status);
    @Query(value = "select pd.product_id as productId, \n" +
            "\t   pd.discount_id as discountId, \n" +
            "\t   d.[type] as discountType, \n" +
            "\t   d.[percent] as discountPercent, \n" +
            "\t   d.money_discount as discountMoney  from product_discount pd inner join discount d on pd.discount_id = d.id \n" +
            "\t   where getdate() between d.[start_date] and d.[end_date]\n" +
            "\t   and pd.[status] = 1\n" +
            "\t   and pd.product_id in ?1", nativeQuery = true)
    List<ProductDiscountMapper> getProductDiscountByProductId(List<Integer> productIds);
}
