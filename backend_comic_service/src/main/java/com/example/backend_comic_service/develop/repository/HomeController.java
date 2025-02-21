package com.example.backend_comic_service.develop.repository;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/home")
public class HomeController {
    @RequestMapping(value = "/index", method = RequestMethod.POST)
    public String Home(){
        return "Hello World";
    }
}
