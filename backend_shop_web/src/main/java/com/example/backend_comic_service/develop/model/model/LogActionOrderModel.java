package com.example.backend_comic_service.develop.model.model;

import com.example.backend_comic_service.develop.enums.OrderStatusEnum;
import com.example.backend_comic_service.develop.utils.Common;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class LogActionOrderModel {
    private Integer id;
    private String description;
    private OrderStatusEnum statusId;
    @DateTimeFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME)
    @JsonFormat(pattern = Common.FORMAT_DD_MM_YYYY_TIME, timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdDate;
    private String name;
}
