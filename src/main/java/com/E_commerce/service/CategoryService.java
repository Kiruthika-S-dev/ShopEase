package com.E_commerce.service;

import com.E_commerce.dto.ApiResponse;
import com.E_commerce.entity.Category;
import com.E_commerce.repository.CategoryRepository;
import com.E_commerce.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() ->
                new AppException("Category not found with id: " + id,
                	    org.springframework.http.HttpStatus.NOT_FOUND));
    }

    public ApiResponse addCategory(Category category) {
        if (categoryRepository.existsByName(
                category.getName())) {
            return new ApiResponse(
                "Category already exists!", false);
        }
        categoryRepository.save(category);
        return new ApiResponse(
            "Category added successfully!", true);
    }

    public ApiResponse updateCategory(
            Long id, Category updated) {
        Category existing = getCategoryById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        categoryRepository.save(existing);
        return new ApiResponse(
            "Category updated successfully!", true);
    }

    public ApiResponse deleteCategory(Long id) {
        Category existing = getCategoryById(id);
        categoryRepository.delete(existing);
        return new ApiResponse(
            "Category deleted successfully!", true);
    }
}