package com.E_commerce.controller;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            // Get amount from request (in rupees)
            double amount = Double.parseDouble(request.get("amount").toString());

            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject options = new JSONObject();
            options.put("amount", (int)(amount * 100)); // convert to paise
            options.put("currency", "INR");
            options.put("receipt", "receipt_" + System.currentTimeMillis());

            com.razorpay.Order order = client.orders.create(options);

            Map<String, String> response = new HashMap<>();
            response.put("orderId", order.get("id").toString());
            response.put("amount", String.valueOf((int)(amount * 100)));
            response.put("currency", "INR");
            response.put("keyId", keyId);

            return ResponseEntity.ok(response);

        } catch (RazorpayException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Payment creation failed: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        try {
            String razorpayOrderId   = request.get("razorpay_order_id");
            String razorpayPaymentId = request.get("razorpay_payment_id");
            String razorpaySignature = request.get("razorpay_signature");

            // Generate HMAC SHA256 signature
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes("UTF-8"), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes("UTF-8"));

            // Convert to hex string
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            String generatedSignature = sb.toString();

            if (generatedSignature.equals(razorpaySignature)) {
                return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "paymentId", razorpayPaymentId
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "status", "failed",
                    "message", "Invalid payment signature"
                ));
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Verification failed: " + e.getMessage()));
        }
    }
}