package com.E_commerce.service;

import com.E_commerce.dto.ApiResponse;
import com.E_commerce.entity.*;
import com.E_commerce.enums.OrderStatus;
import com.E_commerce.repository.*;
import com.E_commerce.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Order placeOrder(String email,
            String shippingAddress) {
    	
        Cart cart = cartRepository
            .findByUserEmail(email)
            .orElseThrow(() ->
            new AppException("Cart not found!", HttpStatus.NOT_FOUND));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty!");
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
            new AppException("Cart not found!", HttpStatus.NOT_FOUND));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);

        double total = 0;
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtTime(
                cartItem.getPriceAtTime());
            order.getItems().add(orderItem);

            total += cartItem.getPriceAtTime()
                * cartItem.getQuantity();

            // Reduce stock
            Product product = cartItem.getProduct();
            product.setStockQuantity(
                product.getStockQuantity()
                - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        // Clear cart after order
        cart.getItems().clear();
        cartRepository.save(cart);

        return saved;
    }

    public List<Order> getMyOrders(String email) {
        return orderRepository.findByUserEmail(email);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() ->
            new AppException("Order not found with id: " + id,
            	    HttpStatus.NOT_FOUND));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public ApiResponse updateOrderStatus(
            Long id, OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
        return new ApiResponse(
            "Order status updated to "
            + status.name() + "!", true);
    }
}