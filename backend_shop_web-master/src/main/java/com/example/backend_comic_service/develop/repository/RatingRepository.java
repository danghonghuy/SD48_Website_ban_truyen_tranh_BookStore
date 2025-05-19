package com.example.backend_comic_service.develop.repository;

import com.example.backend_comic_service.develop.entity.RatingEntity;
import com.example.backend_comic_service.develop.model.mapper.RatingMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Integer> {
    Optional<RatingEntity> findById(Integer id);
    @Query(value = "select r.*, p.id as productId, p.[name] as productName, u.id as userId, u.full_name as fullName, u.[user_name] as userName from rating r inner join [dbo].[product] p on r.product_id = p.id\n" +
            "   inner join [dbo].[users] u on r.[user_id] = u.id where r.product_id = isnull(?1, r.product_id) and r.rate between isnull(?2, r.rate) and isnull(?3, r.rate)\n", nativeQuery = true)
    Page<RatingMapper> getListRates(Integer productId, Integer fromRate, Integer toRate, Pageable pageable);
    @Query(value = "update rating set is_delete = 1 and [status] = 0 where id = ?1", nativeQuery = true)
    void deleteById(Integer id);
}
