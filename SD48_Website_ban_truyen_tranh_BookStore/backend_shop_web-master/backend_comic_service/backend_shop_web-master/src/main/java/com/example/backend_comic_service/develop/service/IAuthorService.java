package com.example.backend_comic_service.develop.service;

import com.example.backend_comic_service.develop.model.model.AuthorModel; // Hoặc DTO nếu bạn dùng
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IAuthorService {

    Page<AuthorModel> getAllAuthors(String keySearch, Pageable pageable);

    AuthorModel getAuthorById(Integer id);

    AuthorModel createAuthor(AuthorModel authorModel);

    AuthorModel updateAuthor(Integer id, AuthorModel authorModel);

    void deleteAuthor(Integer id);

    // Bạn có thể thêm các phương thức nghiệp vụ khác ở đây nếu cần trong tương lai
    // Ví dụ:
    // boolean checkAuthorNameExists(String name);
    // List<AuthorModel> getTopAuthors(int limit);
}
