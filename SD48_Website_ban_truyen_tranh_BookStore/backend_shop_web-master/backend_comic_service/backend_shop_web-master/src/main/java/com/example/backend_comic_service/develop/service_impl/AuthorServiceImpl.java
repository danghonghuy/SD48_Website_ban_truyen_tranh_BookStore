package com.example.backend_comic_service.develop.service_impl;


import com.example.backend_comic_service.develop.entity.AuthorEntity;
import com.example.backend_comic_service.develop.exception.ResourceNotFoundException; // Tạo class exception này
import com.example.backend_comic_service.develop.exception.DuplicateRecordException; // Tạo class exception này
import com.example.backend_comic_service.develop.model.model.AuthorModel;
import com.example.backend_comic_service.develop.repository.AuthorRepository;
import com.example.backend_comic_service.develop.service.IAuthorService;
import org.modelmapper.ModelMapper; // Hoặc dùng cách convert thủ công
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class AuthorServiceImpl implements IAuthorService {

    private final AuthorRepository authorRepository;
    private final ModelMapper modelMapper; // Sử dụng ModelMapper để chuyển đổi entity và model

    @Autowired
    public AuthorServiceImpl(AuthorRepository authorRepository, ModelMapper modelMapper) {
        this.authorRepository = authorRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuthorModel> getAllAuthors(String keySearch, Pageable pageable) {
        Page<AuthorEntity> authorEntitiesPage;
        if (keySearch != null && !keySearch.trim().isEmpty()) {
            authorEntitiesPage = authorRepository.findByNameContainingIgnoreCase(keySearch.trim(), pageable);
        } else {
            authorEntitiesPage = authorRepository.findAll(pageable);
        }
        return authorEntitiesPage.map(authorEntity -> modelMapper.map(authorEntity, AuthorModel.class));
    }

    @Override
    @Transactional(readOnly = true)
    public AuthorModel getAuthorById(Integer id) {
        AuthorEntity authorEntity = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + id));
        return modelMapper.map(authorEntity, AuthorModel.class);
    }

    @Override
    @Transactional
    public AuthorModel createAuthor(AuthorModel authorModel) {
        if (authorRepository.existsByNameIgnoreCase(authorModel.getName())) {
            throw new DuplicateRecordException("Author with name '" + authorModel.getName() + "' already exists.");
        }
        AuthorEntity authorEntity = modelMapper.map(authorModel, AuthorEntity.class);
        // @PrePersist trong AuthorEntity sẽ tự động set createdDate
        AuthorEntity savedEntity = authorRepository.save(authorEntity);
        return modelMapper.map(savedEntity, AuthorModel.class);
    }

    @Override
    @Transactional
    public AuthorModel updateAuthor(Integer id, AuthorModel authorModel) {
        AuthorEntity existingEntity = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + id));

        // Kiểm tra nếu tên thay đổi và tên mới đã tồn tại cho một tác giả khác
        if (!existingEntity.getName().equalsIgnoreCase(authorModel.getName()) &&
                authorRepository.existsByNameIgnoreCase(authorModel.getName())) {
            throw new DuplicateRecordException("Author with name '" + authorModel.getName() + "' already exists.");
        }

        existingEntity.setName(authorModel.getName());
        existingEntity.setDescription(authorModel.getDescription());
        // @PreUpdate trong AuthorEntity sẽ tự động set updatedDate

        AuthorEntity updatedEntity = authorRepository.save(existingEntity);
        return modelMapper.map(updatedEntity, AuthorModel.class);
    }

    @Override
    @Transactional
    public void deleteAuthor(Integer id) {
        if (!authorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Author not found with id: " + id);
        }
        // Cân nhắc xử lý logic liên quan đến ProductEntity nếu cần
        // Ví dụ: không cho xóa nếu tác giả còn sản phẩm, hoặc gán sản phẩm cho tác giả "Unknown"
        authorRepository.deleteById(id);
    }
}
