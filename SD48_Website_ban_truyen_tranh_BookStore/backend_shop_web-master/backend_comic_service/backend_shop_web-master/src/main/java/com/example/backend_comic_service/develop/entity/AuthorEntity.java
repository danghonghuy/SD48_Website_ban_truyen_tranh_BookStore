package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.AuthorModel; // Đảm bảo import đúng package
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Authors")
public class AuthorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false, length = 250, unique = true)
    private String name;

    @Lob
    @Column(name = "description", columnDefinition = "NTEXT")
    private String description;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @ManyToMany(mappedBy = "authors", fetch = FetchType.LAZY)
    private Set<ProductEntity> products = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

    public AuthorModel toModel() {
        AuthorModel model = new AuthorModel();
        model.setId(this.id);
        model.setName(this.name);
        // Nếu AuthorModel có trường description, bạn có thể thêm:
        // if (this.description != null) {
        //     model.setDescription(this.description);
        // }
        return model;
    }
}