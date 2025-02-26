package com.example.backend_comic_service.develop.service_impl;

import com.example.backend_comic_service.develop.repository.ProductDiscountRepository;
import com.example.backend_comic_service.develop.service.IProductDiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductDiscountServiceImpl implements IProductDiscountService {
    @Autowired
    private ProductDiscountRepository productDiscountRepository;
}
