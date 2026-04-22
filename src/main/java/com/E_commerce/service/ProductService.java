package com.E_commerce.service;

import com.E_commerce.dto.ApiResponse;
import com.E_commerce.entity.Category;
import com.E_commerce.entity.Product;
import com.E_commerce.repository.CategoryRepository;
import com.E_commerce.repository.ProductRepository;
import com.E_commerce.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Page<Product> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                new AppException("Product not found with id: " + id,
                	    HttpStatus.NOT_FOUND));
    }

    public List<Product> searchProducts(String query) {
        // Search by product name
        List<Product> byName = productRepository
            .findByNameContainingIgnoreCase(query);
        
        // Search by category name
        List<Product> byCategory = productRepository
            .findByCategory_NameContainingIgnoreCase(query);
        
        // Combine both results, remove duplicates
        Set<Long> seen = new HashSet<>();
        List<Product> combined = new ArrayList<>();
        
        for (Product p : byName) {
            if (seen.add(p.getId())) combined.add(p);
        }
        for (Product p : byCategory) {
            if (seen.add(p.getId())) combined.add(p);
        }
        return combined;
    }

    public ApiResponse addProduct(Product product,
            Long categoryId) {
        Category category = categoryRepository
            .findById(categoryId)
            .orElseThrow(() ->
            new AppException("Category not found!",
            	    HttpStatus.NOT_FOUND));
        product.setCategory(category);
        productRepository.save(product);
        return new ApiResponse(
            "Product added successfully!", true);
    }

    public ApiResponse updateProduct(Long id,
            Product updated, Long categoryId) {
        Product existing = getProductById(id);
        Category category = categoryRepository
            .findById(categoryId)
            .orElseThrow(() ->
            new AppException("Category not found!",
            	    HttpStatus.NOT_FOUND));
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setImageUrl(updated.getImageUrl());
        existing.setCategory(category);
        productRepository.save(existing);
        return new ApiResponse(
            "Product updated successfully!", true);
    }

    public ApiResponse deleteProduct(Long id) {
        Product existing = getProductById(id);
        productRepository.delete(existing);
        return new ApiResponse(
            "Product deleted successfully!", true);
    }

	public List<Product> getByCategory(Long categoryId) {
		return productRepository.findByCategoryId(categoryId);
	}
}