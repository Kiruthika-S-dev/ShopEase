package com.E_commerce.repository;

import com.E_commerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByUserEmail(String email);
}