package com.E_commerce.service;

import com.E_commerce.dto.*;
import com.E_commerce.entity.User;
import com.E_commerce.enums.Role;
import com.E_commerce.repository.UserRepository;
import com.E_commerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse("Email already exists!", false);
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
            passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);

        userRepository.save(user);
        return new ApiResponse(
            "User registered successfully!", true);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() -> 
                new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        String token = jwtUtil.generateToken(
            user.getEmail(), user.getRole().name());

        return new LoginResponse(
            token,
            user.getRole().name(),
            user.getEmail(),
            user.getName());
    }
}