package com.example.backend_comic_service.develop.entity;

import com.example.backend_comic_service.develop.model.dto.ImageDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "images")
public class ImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "image_url")
    private String imageUrl;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductEntity productEntity;
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    @Column(name = "created_by")
    private Integer createdBy;
    @Column(name = "update_date")
    private LocalDateTime updateDate;
    @Column(name = "update_by")
    private Integer updateBy;
    @Column(name = "status")
    private Integer status;
    @Column(name = "is_deleted")
    private Integer isDeleted;

    public ImageDTO toDto() {
        ImageDTO dto = null;
        if (this.isDeleted == 0) {
            dto = new ImageDTO();
            dto.setImageUrl(this.imageUrl);
            dto.setId(this.id);
            dto.setIsDeleted(this.isDeleted);
         }
        return dto;
    }
}
