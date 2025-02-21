package com.example.backend_comic_service.develop.model.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class SendMailModel {
    private String toMail;
    private String fromMail;
    private String content;
    private String subject;
}
