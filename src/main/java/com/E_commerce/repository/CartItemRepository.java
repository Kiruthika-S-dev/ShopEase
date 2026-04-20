package com.E_commerce.repository;

import com.E_commerce.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {
}