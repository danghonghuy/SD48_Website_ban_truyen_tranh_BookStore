package com.example.backend_comic_service.develop.model.model;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DeliveryModel {
    private int id;
    private String code;
    private String name;
    private Date createdDate;
    private int createdBy;
    private Date updatedDate;
    private int updatedBy;
    private Integer fee;
}
