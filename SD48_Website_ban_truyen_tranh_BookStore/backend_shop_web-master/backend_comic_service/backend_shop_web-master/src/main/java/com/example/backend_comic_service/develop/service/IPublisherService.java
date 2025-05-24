package com.example.backend_comic_service.develop.service; // Đảm bảo package đúng

import com.example.backend_comic_service.develop.model.model.PublisherModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IPublisherService {

    Page<PublisherModel> getAllPublishers(String keySearch, Pageable pageable);

    PublisherModel getPublisherById(Integer id);

    PublisherModel createPublisher(PublisherModel publisherModel);

    PublisherModel updatePublisher(Integer id, PublisherModel publisherModel);

    void deletePublisher(Integer id);
}