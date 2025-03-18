package com.example.backend_comic_service.develop.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.security.MessageDigest;

@Component
public class HashService {
    @Value("com.key.hash.md5")
    private String md5Key;
    public String md5Hash(String data){
       try{
           MessageDigest md = MessageDigest.getInstance("MD5");
           byte[] messageDigest = md.digest(data.getBytes());
           BigInteger no = new BigInteger(1, messageDigest);
           String hashtext = no.toString(16);
           while (hashtext.length() < 32) {
               hashtext = "0" + hashtext;
           }
           return hashtext;
       }
       catch (Exception e){
           return null;
       }

    }
}
