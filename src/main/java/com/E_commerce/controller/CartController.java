package com.E_commerce.controller;

import com.E_commerce.dto.ApiResponse;
import com.E_commerce.dto.CartItemRequest;
import com.E_commerce.entity.Cart;
import com.E_commerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(
            Principal principal) {
        return ResponseEntity.ok(
            cartService.getCart(principal.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addToCart(
            @RequestBody CartItemRequest request,
            Principal principal) {
        return ResponseEntity.ok(
            cartService.addToCart(
                principal.getName(), request));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<ApiResponse> updateItem(
            @PathVariable Long itemId,
            @RequestParam Integer quantity,
            Principal principal) {
        return ResponseEntity.ok(
            cartService.updateCartItem(
                principal.getName(), itemId, quantity));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<ApiResponse> removeItem(
            @PathVariable Long itemId,
            Principal principal) {
        return ResponseEntity.ok(
            cartService.removeFromCart(
                principal.getName(), itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse> clearCart(
            Principal principal) {
        return ResponseEntity.ok(
            cartService.clearCart(principal.getName()));
    }
}