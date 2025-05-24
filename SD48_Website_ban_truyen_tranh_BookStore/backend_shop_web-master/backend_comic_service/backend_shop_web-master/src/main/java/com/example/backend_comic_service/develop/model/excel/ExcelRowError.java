package com.example.backend_comic_service.develop.model.excel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExcelRowError {
    private int rowNumber;
    private String productNameAttempted;
    private List<String> errorMessages;
}