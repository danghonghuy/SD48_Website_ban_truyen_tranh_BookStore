package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.model.DistributorModel; // Đảm bảo import đúng package
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
@Table(name = "Distributors")
public class DistributorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false, length = 250, unique = true)
    private String name;

    @Lob
    @Column(name = "description", columnDefinition = "NTEXT")
    private String description;

    @Column(name = "contact_info", length = 500)
    private String contactInfo;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @OneToMany(mappedBy = "distributor", fetch = FetchType.LAZY)
    private List<ProductEntity> products = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

    public DistributorModel toModel() {
        DistributorModel model = new DistributorModel();
        model.setId(this.id);
        model.setName(this.name);
        // Nếu DistributorModel có các trường khác, bạn có thể thêm vào đây:
        // if (this.description != null) model.setDescription(this.description);
        // if (this.contactInfo != null) model.setContactInfo(this.contactInfo);
        return model;
    }
}