package com.E_commerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.E_commerce.entity.Category;
import com.E_commerce.entity.Product;
import com.E_commerce.exception.AppException;
import com.E_commerce.repository.CategoryRepository;
import com.E_commerce.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    private Product product1;
    private Product product2;
    private Category category;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1L);
        category.setName("Electronics");

        product1 = new Product();
        product1.setId(1L);
        product1.setName("iPhone 15");
        product1.setPrice(79999.0);
        product1.setStockQuantity(10);
        product1.setCategory(category);

        product2 = new Product();
        product2.setId(2L);
        product2.setName("Dell Laptop");
        product2.setPrice(55999.0);
        product2.setStockQuantity(5);
        product2.setCategory(category);
    }

    // ── TEST 1: Get product by ID — success ──
    @Test
    void getProductById_WhenExists_ShouldReturnProduct() {
        when(productRepository.findById(1L))
            .thenReturn(Optional.of(product1));

        Product result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals("iPhone 15", result.getName());
        assertEquals(79999.0, result.getPrice());
    }

    // ── TEST 2: Get product by ID — not found ──
    @Test
    void getProductById_WhenNotExists_ShouldThrowException() {
        when(productRepository.findById(99L))
            .thenReturn(Optional.empty());

        assertThrows(AppException.class, () -> {
            productService.getProductById(99L);
        });
    }

    // ── TEST 3: Search by name — found ──
    @Test
    void searchProducts_ShouldReturnMatchingProducts() {
        when(productRepository
            .findByNameContainingIgnoreCase("iPhone"))
            .thenReturn(Arrays.asList(product1));

        List<Product> result = productService
            .searchProducts("iPhone");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("iPhone 15", result.get(0).getName());
    }

    // ── TEST 4: Search by name — empty ──
    @Test
    void searchProducts_WhenNoMatch_ShouldReturnEmptyList() {
        when(productRepository
            .findByNameContainingIgnoreCase("xyz"))
            .thenReturn(Arrays.asList());

        List<Product> result = productService
            .searchProducts("xyz");

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // ── TEST 5: Get by category ──
    @Test
    void getProductsByCategory_ShouldReturnProducts() {
        when(productRepository.findByCategoryId(1L))
            .thenReturn(Arrays.asList(product1, product2));

        List<Product> result = productRepository
            .findByCategoryId(1L);

        assertEquals(2, result.size());
    }
}