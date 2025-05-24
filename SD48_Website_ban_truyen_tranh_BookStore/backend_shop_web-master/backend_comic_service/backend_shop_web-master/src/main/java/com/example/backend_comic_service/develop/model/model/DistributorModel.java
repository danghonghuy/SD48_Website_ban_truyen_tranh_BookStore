package com.example.backend_comic_service.develop.model.model; // Đảm bảo package đúng

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data // Bao gồm @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor
@NoArgsConstructor
@AllArgsConstructor
public class DistributorModel {

    private Integer id;
    private String name;
    private String description;
    private String contactInfo;
    private LocalDateTime createdDate; // Thêm nếu bạn muốn hiển thị hoặc xử lý ở frontend
    private LocalDateTime updatedDate; // Thêm nếu bạn muốn hiển thị hoặc xử lý ở frontend

    // Bạn có thể bỏ createdDate và updatedDate nếu không cần chúng trong Model
    // mà chỉ quan tâm đến chúng ở Entity và Database.
    // Tuy nhiên, việc có chúng trong Model có thể hữu ích cho việc hiển thị thông tin đầy đủ.
}