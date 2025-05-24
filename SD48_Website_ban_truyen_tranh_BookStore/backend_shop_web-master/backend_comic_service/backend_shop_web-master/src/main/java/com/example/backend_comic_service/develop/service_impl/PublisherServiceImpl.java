package com.example.backend_comic_service.develop.service_impl;



import com.example.backend_comic_service.develop.entity.PublisherEntity;
import com.example.backend_comic_service.develop.exception.ResourceNotFoundException;
import com.example.backend_comic_service.develop.exception.DuplicateRecordException;
import com.example.backend_comic_service.develop.model.model.PublisherModel;
import com.example.backend_comic_service.develop.repository.PublisherRepository;
import com.example.backend_comic_service.develop.service.IPublisherService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublisherServiceImpl implements IPublisherService {

    private final PublisherRepository publisherRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public PublisherServiceImpl(PublisherRepository publisherRepository, ModelMapper modelMapper) {
        this.publisherRepository = publisherRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PublisherModel> getAllPublishers(String keySearch, Pageable pageable) {
        Page<PublisherEntity> publisherEntitiesPage;
        if (keySearch != null && !keySearch.trim().isEmpty()) {
            // Giả sử tìm kiếm theo tên. Nếu muốn tìm theo email, phone, address thì cần thêm method trong Repository
            publisherEntitiesPage = publisherRepository.findByNameContainingIgnoreCase(keySearch.trim(), pageable);
        } else {
            publisherEntitiesPage = publisherRepository.findAll(pageable);
        }
        return publisherEntitiesPage.map(entity -> modelMapper.map(entity, PublisherModel.class));
    }

    @Override
    @Transactional(readOnly = true)
    public PublisherModel getPublisherById(Integer id) {
        PublisherEntity publisherEntity = publisherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publisher not found with id: " + id));
        return modelMapper.map(publisherEntity, PublisherModel.class);
    }

    @Override
    @Transactional
    public PublisherModel createPublisher(PublisherModel publisherModel) {
        if (publisherRepository.existsByNameIgnoreCase(publisherModel.getName())) {
            throw new DuplicateRecordException("Publisher with name '" + publisherModel.getName() + "' already exists.");
        }
        // Có thể thêm kiểm tra trùng email nếu email là unique
        // if (publisherModel.getEmail() != null && publisherRepository.existsByEmailIgnoreCase(publisherModel.getEmail())) {
        //     throw new DuplicateRecordException("Publisher with email '" + publisherModel.getEmail() + "' already exists.");
        // }

        PublisherEntity publisherEntity = modelMapper.map(publisherModel, PublisherEntity.class);
        PublisherEntity savedEntity = publisherRepository.save(publisherEntity);
        return modelMapper.map(savedEntity, PublisherModel.class);
    }

    @Override
    @Transactional
    public PublisherModel updatePublisher(Integer id, PublisherModel publisherModel) {
        PublisherEntity existingEntity = publisherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publisher not found with id: " + id));

        if (!existingEntity.getName().equalsIgnoreCase(publisherModel.getName()) &&
                publisherRepository.existsByNameIgnoreCase(publisherModel.getName())) {
            throw new DuplicateRecordException("Publisher with name '" + publisherModel.getName() + "' already exists.");
        }
        // Tương tự, kiểm tra trùng email nếu email thay đổi và email mới đã tồn tại
        // if (publisherModel.getEmail() != null &&
        //     !publisherModel.getEmail().equalsIgnoreCase(existingEntity.getEmail()) &&
        //     publisherRepository.existsByEmailIgnoreCase(publisherModel.getEmail())) {
        //     throw new DuplicateRecordException("Publisher with email '" + publisherModel.getEmail() + "' already exists.");
        // }


        existingEntity.setName(publisherModel.getName());
        existingEntity.setDescription(publisherModel.getDescription());
        existingEntity.setAddress(publisherModel.getAddress());
        existingEntity.setPhoneNumber(publisherModel.getPhoneNumber());
        existingEntity.setEmail(publisherModel.getEmail());
        // createdDate và updatedDate được xử lý bởi @PrePersist/@PreUpdate trong Entity

        PublisherEntity updatedEntity = publisherRepository.save(existingEntity);
        return modelMapper.map(updatedEntity, PublisherModel.class);
    }

    @Override
    @Transactional
    public void deletePublisher(Integer id) {
        if (!publisherRepository.existsById(id)) {
            throw new ResourceNotFoundException("Publisher not found with id: " + id);
        }
        publisherRepository.deleteById(id);
    }
}