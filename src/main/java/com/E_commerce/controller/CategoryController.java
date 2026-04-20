package com.E_commerce.controller;

import com.E_commerce.dto.ApiResponse;
import com.E_commerce.entity.Category;
import com.E_commerce.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(
            categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            categoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> add(
            @RequestBody Category category) {
        return ResponseEntity.ok(
            categoryService.addCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(
            @PathVariable Long id,
            @RequestBody Category category) {
        return ResponseEntity.ok(
            categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            categoryService.deleteCategory(id));
    }
}