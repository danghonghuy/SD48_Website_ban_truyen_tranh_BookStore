package com.example.backend_comic_service.develop.exception;

 import com.example.backend_comic_service.develop.utils.ErrorCodeConst;
 import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
 import java.util.Locale;

@Service
@Slf4j
public class ResponseFactory {
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private Locale defaultLocale;

    public <D> ResponseEntity success(D data) {
        var responseObject = GeneralResponse.createResponse(data);
        responseObject.setSuccess(true);
        return ResponseEntity.ok().body(responseObject);
    }

    public <D> ResponseEntity fail(D data, ErrorCodeConst code, String message) {
        if (message == null || message.isEmpty()) {
            message = code.getMessage();
        }
        var translatedMessage = message;
        try {
            translatedMessage = this.messageSource.getMessage(message, null, defaultLocale);
        } catch (Exception e) {
        }
        var responseObject = GeneralResponse.createResponse(data);
        responseObject.setErrorCode(code.getCode());
        responseObject.setMessage(translatedMessage);
        return ResponseEntity.status(code.getHttpCode()).body(responseObject);
    }

    public <D> ResponseEntity success(D data, String message) {
        var responseObject = GeneralResponse.createResponse(data);
        responseObject.setSuccess(true);
        responseObject.setMessage(message);
        return ResponseEntity.ok().body(responseObject);
    }
}
