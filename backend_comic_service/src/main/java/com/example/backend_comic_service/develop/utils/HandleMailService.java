package com.example.backend_comic_service.develop.utils;

import com.example.backend_comic_service.develop.model.model.SendMailModel;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
@Slf4j
public class HandleMailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromMail;

    public void sendMail(SendMailModel sendMailMapper) {
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromMail);
            message.setSubject(sendMailMapper.getSubject());
            message.setTo(sendMailMapper.getToMail());
            message.setText(sendMailMapper.getContent());
            mailSender.send(message);
        }
        catch (Exception e){
            log.error(e.getMessage());
        }
    }

    public void sendMailWithAttachment(SendMailModel sendMailMapper) {
        try{
            MimeMessage mimeMailMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper;
            mimeMessageHelper = new MimeMessageHelper(mimeMailMessage, true);
            mimeMessageHelper.setFrom(fromMail);
            mimeMessageHelper.setTo(sendMailMapper.getToMail());
            mimeMessageHelper.setText(sendMailMapper.getContent());
            mimeMessageHelper.setSubject(sendMailMapper.getSubject());
            FileSystemResource file = new FileSystemResource(new File("null", String.valueOf(0)));
            mimeMessageHelper.addAttachment(file.getFilename(), file);
            mailSender.send(mimeMailMessage);
        }
        catch (Exception e){
            log.error(e.getMessage());
        }
    }

}
