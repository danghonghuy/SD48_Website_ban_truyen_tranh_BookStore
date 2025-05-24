package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.PublisherModel; // Đảm bảo import đúng package
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Publishers")
public class PublisherEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false, length = 250, unique = true)
    private String name;

    @Lob
    @Column(name = "description", columnDefinition = "NTEXT")
    private String description;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Column(name = "email", length = 250)
    private String email;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @OneToMany(mappedBy = "publisher", fetch = FetchType.LAZY)
    private List<ProductEntity> products = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

    public PublisherModel toModel() {
        PublisherModel model = new PublisherModel();
        model.setId(this.id);
        model.setName(this.name);
        // Nếu PublisherModel có các trường khác, bạn có thể thêm vào đây:
        // if (this.description != null) model.setDescription(this.description);
        // if (this.address != null) model.setAddress(this.address);
        return model;
    }
}