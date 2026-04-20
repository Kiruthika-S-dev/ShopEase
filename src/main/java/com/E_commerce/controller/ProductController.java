package com.E_commerce.controller;

import com.E_commerce.dto.ApiResponse;
import com.E_commerce.entity.Product;
import com.E_commerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Page<Product>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
            productService.getAllProducts(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            productService.getProductById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(
            @RequestParam String name) {
        return ResponseEntity.ok(
            productService.searchByName(name));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getByCategory(
            @PathVariable Long categoryId) {
        return ResponseEntity.ok(
            productService.getByCategory(categoryId));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> add(
            @RequestBody Product product,
            @RequestParam Long categoryId) {
        return ResponseEntity.ok(
            productService.addProduct(product, categoryId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(
            @PathVariable Long id,
            @RequestBody Product product,
            @RequestParam Long categoryId) {
        return ResponseEntity.ok(
            productService.updateProduct(
                id, product, categoryId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            productService.deleteProduct(id));
    }
}