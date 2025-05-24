package com.example.backend_comic_service.develop.configs.configs_sercurity_service;

import org.springframework.beans.factory.annotation.Value; // Thêm import này
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfigResource implements WebMvcConfigurer {

    // Inject giá trị từ application.properties
    @Value("${com.develop.path-save-image}")
    private String diskUploadPath; // Đây là đường dẫn tuyệt đối trên đĩa, ví dụ: D:/comic_images/uploads

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String urlMapping = "/uploads/**"; // URL client sẽ dùng

        // Đường dẫn đến thư mục trên đĩa, phải có "file:" ở đầu
        // và đảm bảo có dấu "/" ở cuối thư mục
        String diskLocation = "file:" + diskUploadPath + (diskUploadPath.endsWith("/") ? "" : "/");

        System.out.println("WEB_CONFIG_RESOURCE_DEBUG: Mapping URL '" + urlMapping + "' to disk location '" + diskLocation + "'");

        registry.addResourceHandler(urlMapping)
                .addResourceLocations(diskLocation) // SỬA Ở ĐÂY!
                .setCachePeriod(0); // Tắt cache trong môi trường dev để thấy thay đổi ngay
    }
}