package com.E_commerce.controller;

import com.E_commerce.dto.ApiResponse;
import com.E_commerce.entity.Order;
import com.E_commerce.enums.OrderStatus;
import com.E_commerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(
            @RequestParam String shippingAddress,
            Principal principal) {
        return ResponseEntity.ok(
            orderService.placeOrder(
                principal.getName(), shippingAddress));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> myOrders(
            Principal principal) {
        return ResponseEntity.ok(
            orderService.getMyOrders(
                principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            orderService.getOrderById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(
            orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(
            orderService.updateOrderStatus(id, status));
    }
}