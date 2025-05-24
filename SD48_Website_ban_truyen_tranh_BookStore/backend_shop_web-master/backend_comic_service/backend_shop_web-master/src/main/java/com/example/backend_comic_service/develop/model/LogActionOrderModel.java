package com.example.backend_comic_service.develop.model;

import lombok.*;

import java.sql.Date;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class LogActionOrderModel {

    private Integer id;
    private Integer orderId;
    private Integer userId;
    private String userName;
    private Integer status;
    private String statusName;
    private LocalDateTime createdDate;
}
