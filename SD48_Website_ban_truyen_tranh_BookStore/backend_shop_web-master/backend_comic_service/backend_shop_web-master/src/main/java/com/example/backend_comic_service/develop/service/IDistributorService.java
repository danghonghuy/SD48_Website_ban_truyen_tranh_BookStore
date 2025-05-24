package com.example.backend_comic_service.develop.service; // Đảm bảo package đúng

import com.example.backend_comic_service.develop.model.model.DistributorModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IDistributorService {

    Page<DistributorModel> getAllDistributors(String keySearch, Pageable pageable);

    DistributorModel getDistributorById(Integer id);

    DistributorModel createDistributor(DistributorModel distributorModel);

    DistributorModel updateDistributor(Integer id, DistributorModel distributorModel);

    void deleteDistributor(Integer id);
}