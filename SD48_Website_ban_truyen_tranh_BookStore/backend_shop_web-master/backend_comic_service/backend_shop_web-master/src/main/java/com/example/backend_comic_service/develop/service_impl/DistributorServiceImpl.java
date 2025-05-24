package com.example.backend_comic_service.develop.service_impl;



import com.example.backend_comic_service.develop.entity.DistributorEntity;
import com.example.backend_comic_service.develop.exception.ResourceNotFoundException;
import com.example.backend_comic_service.develop.exception.DuplicateRecordException;
import com.example.backend_comic_service.develop.model.model.DistributorModel;
import com.example.backend_comic_service.develop.repository.DistributorRepository;
import com.example.backend_comic_service.develop.service.IDistributorService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DistributorServiceImpl implements IDistributorService {

    private final DistributorRepository distributorRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public DistributorServiceImpl(DistributorRepository distributorRepository, ModelMapper modelMapper) {
        this.distributorRepository = distributorRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DistributorModel> getAllDistributors(String keySearch, Pageable pageable) {
        Page<DistributorEntity> distributorEntitiesPage;
        if (keySearch != null && !keySearch.trim().isEmpty()) {
            distributorEntitiesPage = distributorRepository.findByNameContainingIgnoreCase(keySearch.trim(), pageable);
        } else {
            distributorEntitiesPage = distributorRepository.findAll(pageable);
        }
        return distributorEntitiesPage.map(entity -> modelMapper.map(entity, DistributorModel.class));
    }

    @Override
    @Transactional(readOnly = true)
    public DistributorModel getDistributorById(Integer id) {
        DistributorEntity distributorEntity = distributorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Distributor not found with id: " + id));
        return modelMapper.map(distributorEntity, DistributorModel.class);
    }

    @Override
    @Transactional
    public DistributorModel createDistributor(DistributorModel distributorModel) {
        if (distributorRepository.existsByNameIgnoreCase(distributorModel.getName())) {
            throw new DuplicateRecordException("Distributor with name '" + distributorModel.getName() + "' already exists.");
        }
        DistributorEntity distributorEntity = modelMapper.map(distributorModel, DistributorEntity.class);
        DistributorEntity savedEntity = distributorRepository.save(distributorEntity);
        return modelMapper.map(savedEntity, DistributorModel.class);
    }

    @Override
    @Transactional
    public DistributorModel updateDistributor(Integer id, DistributorModel distributorModel) {
        DistributorEntity existingEntity = distributorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Distributor not found with id: " + id));

        if (!existingEntity.getName().equalsIgnoreCase(distributorModel.getName()) &&
                distributorRepository.existsByNameIgnoreCase(distributorModel.getName())) {
            throw new DuplicateRecordException("Distributor with name '" + distributorModel.getName() + "' already exists.");
        }

        existingEntity.setName(distributorModel.getName());
        existingEntity.setDescription(distributorModel.getDescription());
        existingEntity.setContactInfo(distributorModel.getContactInfo());
        // createdDate và updatedDate được xử lý bởi @PrePersist/@PreUpdate trong Entity

        DistributorEntity updatedEntity = distributorRepository.save(existingEntity);
        return modelMapper.map(updatedEntity, DistributorModel.class);
    }

    @Override
    @Transactional
    public void deleteDistributor(Integer id) {
        if (!distributorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Distributor not found with id: " + id);
        }
        distributorRepository.deleteById(id);
    }
}