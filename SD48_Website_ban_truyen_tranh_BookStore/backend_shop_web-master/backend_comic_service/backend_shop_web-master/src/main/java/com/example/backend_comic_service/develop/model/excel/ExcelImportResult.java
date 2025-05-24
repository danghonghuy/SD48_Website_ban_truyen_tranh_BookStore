package com.example.backend_comic_service.develop.model.excel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExcelImportResult {
    private int totalRowsProcessed;
    private int successfullyImportedCount;
    private int failedImportCount;
    private List<ExcelRowError> errors;
}