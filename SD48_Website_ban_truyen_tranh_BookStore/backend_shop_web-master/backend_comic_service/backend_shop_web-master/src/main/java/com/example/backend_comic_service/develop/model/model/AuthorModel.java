package com.example.backend_comic_service.develop.model.model; // Đảm bảo package đúng

import lombok.Data; // Hoặc @Getter @Setter @NoArgsConstructor @AllArgsConstructor

// Nếu dùng Lombok @Data, nó sẽ tự sinh getters/setters
// Nếu không, bạn cần tự viết
// @Data
public class AuthorModel {
    private Integer id;
    private String name;
    private String description; // <--- Bạn cần có trường này và getter/setter cho nó

    // Constructors (nếu không dùng Lombok)
    public AuthorModel() {
    }

    public AuthorModel(Integer id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    // Getters and Setters (nếu không dùng Lombok)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // --- PHƯƠNG THỨC CÒN THIẾU ---
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    // -----------------------------
}