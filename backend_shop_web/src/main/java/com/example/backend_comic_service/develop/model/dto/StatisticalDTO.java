package com.example.backend_comic_service.develop.model.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class StatisticalDTO {
    private Long totalRevenue;
    private Integer totalQuantity;
    private Integer totalSuccess;
    private Integer totalFail;
}
