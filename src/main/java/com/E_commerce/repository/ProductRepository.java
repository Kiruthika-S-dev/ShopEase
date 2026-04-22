package com.E_commerce.repository;

import com.E_commerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, Long> {

    Page<Product> findAll(Pageable pageable);

    List<Product> findByNameContainingIgnoreCase(String name);
    
    List<Product> findByCategoryNameContainingIgnoreCase(String categoryName);

    List<Product> findByCategoryId(Long categoryId);
}