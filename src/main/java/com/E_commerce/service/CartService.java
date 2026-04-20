package com.E_commerce.service;

import com.E_commerce.dto.ApiResponse;
import com.E_commerce.dto.CartItemRequest;
import com.E_commerce.entity.*;
import com.E_commerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private Cart getOrCreateCart(String email) {
        return cartRepository.findByUserEmail(email)
            .orElseGet(() -> {
                User user = userRepository
                    .findByEmail(email)
                    .orElseThrow(() ->
                        new RuntimeException("User not found"));
                Cart cart = new Cart();
                cart.setUser(user);
                return cartRepository.save(cart);
            });
    }

    public Cart getCart(String email) {
        return getOrCreateCart(email);
    }

    public ApiResponse addToCart(String email,
            CartItemRequest request) {
        Cart cart = getOrCreateCart(email);
        Product product = productRepository
            .findById(request.getProductId())
            .orElseThrow(() ->
                new RuntimeException("Product not found"));

        // Check if product already in cart
        Optional<CartItem> existing = cart.getItems()
            .stream()
            .filter(i -> i.getProduct().getId()
                .equals(product.getId()))
            .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(
                existing.get().getQuantity()
                + request.getQuantity());
            cartItemRepository.save(existing.get());
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity());
            item.setPriceAtTime(product.getPrice());
            cartItemRepository.save(item);
        }
        return new ApiResponse(
            "Item added to cart!", true);
    }

    public ApiResponse updateCartItem(String email,
            Long itemId, Integer quantity) {
        CartItem item = cartItemRepository
            .findById(itemId)
            .orElseThrow(() ->
                new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return new ApiResponse(
            "Cart item updated!", true);
    }

    public ApiResponse removeFromCart(String email,
            Long itemId) {
        CartItem item = cartItemRepository
            .findById(itemId)
            .orElseThrow(() ->
                new RuntimeException("Cart item not found"));
        cartItemRepository.delete(item);
        return new ApiResponse(
            "Item removed from cart!", true);
    }

    public ApiResponse clearCart(String email) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().clear();
        cartRepository.save(cart);
        return new ApiResponse("Cart cleared!", true);
    }
}