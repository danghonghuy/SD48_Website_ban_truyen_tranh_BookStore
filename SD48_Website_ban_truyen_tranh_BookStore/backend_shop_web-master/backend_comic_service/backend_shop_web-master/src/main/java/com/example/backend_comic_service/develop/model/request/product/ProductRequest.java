package com.example.backend_comic_service.develop.model.request.product;

import com.example.backend_comic_service.develop.configs.configs_sercurity_service.LocalDateDeserializer;
// import com.example.backend_comic_service.develop.entity.ProductEntity; // Không cần toEntity() trực tiếp ở đây nữa
import com.example.backend_comic_service.develop.model.dto.ImageDTO; // Giữ lại nếu ImageDTO là đúng
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductRequest {
    private Integer id; // Dùng cho cập nhật, có thể là null khi tạo mới
    private String code;
    private String name;
    private String description;
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate datePublish;
    private float price;
    private float priceDiscount;
    private Integer stock;
    private Integer format;
    // createdDate, createdBy, updatedDate, updatedBy thường sẽ được xử lý ở backend, không nên nhận từ client
    // private LocalDateTime createdDate;
    // private Integer createdBy;
    // private LocalDateTime updatedDate;
    // private Integer updatedBy;
    private Integer isDeleted; // Có thể client không nên set trực tiếp trường này, BE xử lý logic xóa mềm
    private Integer categoryId;
    private Integer typeId;
    // categoryName, typeName không cần thiết trong request, BE sẽ lấy từ categoryId, typeId
    // private String categoryName;
    // private String typeName;
    // soldQuantity thường được tính toán, không phải client nhập
    // private Integer soldQuantity;
    private List<ImageDTO> files; // Giả sử ImageDTO chứa thông tin để tạo ImageEntity (ví dụ: URL hoặc file upload)
    private String catalog;
    // private String authorPublish; // XÓA
    private String series;
    // private String author; // XÓA
    // private String publisher; // XÓA
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate datePublic;
    private Integer status;

    // THÊM CÁC TRƯỜNG ID MỚI
    private List<Integer> authorIds; // Danh sách ID của các tác giả
    private Integer publisherId;     // ID của nhà xuất bản
    private Integer distributorId;   // ID của nhà phát hành

    // Phương thức toEntity() trong ProductRequest không còn phù hợp để chuyển đổi trực tiếp thành ProductEntity
    // vì nó thiếu logic để xử lý việc lấy các Entity Author, Publisher, Distributor từ ID
    // và thiết lập các mối quan hệ. Việc này sẽ được thực hiện trong Service layer.
    // public ProductEntity toEntity() { ... } // XÓA HOẶC COMMENT
}