# 🛒 ShopEase — Full Stack E-Commerce Application

A production-ready e-commerce web application with real Razorpay payment integration, JWT authentication, and REST API backend.

🌐 **Live Demo:** [https://regal-crumble-aa8bf5.netlify.app](https://regal-crumble-aa8bf5.netlify.app)  
🔧 **Backend API:** [https://shopease-api-2wdy.onrender.com](https://shopease-api-2wdy.onrender.com)

---

## ✅ Features

- 🔐 User Register & Login with JWT Authentication
- 🛍️ Product Listing with Real Images, Search & Category Filter
- 🛒 Add to Cart, Update Quantity, Remove Items
- 💳 Razorpay Payment Integration (Test Mode)
- 📦 Order Placement & Order History
- 🔒 BCrypt Password Encryption
- 🌐 Global Exception Handling
- 🐳 Docker + Render Deployment
- 📱 Responsive Frontend with Vanilla JavaScript

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.5.13 |
| Security | Spring Security, JWT, BCrypt |
| Database | PostgreSQL, Hibernate/JPA |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Payment | Razorpay |
| Deployment | Render (Backend), Netlify (Frontend) |
| Build | Maven, Docker |

---

## 🌐 Live URLs

| | URL |
|--|-----|
| 🖥️ Frontend | https://regal-crumble-aa8bf5.netlify.app |
| ⚙️ Backend API | https://shopease-api-2wdy.onrender.com |

---

## 📁 Project Structure

```
├── src/main/java/com/E_commerce/
│   ├── controller/     → Auth, Category, Product, Cart, Order, Payment
│   ├── service/        → Business logic
│   ├── repository/     → JPA repositories
│   ├── entity/         → User, Product, Cart, Order, etc.
│   ├── dto/            → Request/Response objects
│   ├── security/       → JWT Filter & Util
│   ├── config/         → SecurityConfig (CORS, BCrypt)
│   └── exception/      → GlobalExceptionHandler
├── frontend/
│   ├── js/             → api.js, auth.js, products.js, cart.js, orders.js
│   ├── css/            → style.css
│   └── *.html          → login, index, cart, orders
├── Dockerfile
└── pom.xml
```

---

## 🔑 API Endpoints

### Auth (Public)
```
POST /api/auth/register
POST /api/auth/login
```

### Products (Public)
```
GET  /api/products
GET  /api/products/{id}
GET  /api/products/search?name=
GET  /api/products/category/{categoryId}
```

### Cart (JWT Required)
```
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update/{itemId}?quantity=
DELETE /api/cart/remove/{itemId}
DELETE /api/cart/clear
```

### Orders (JWT Required)
```
POST /api/orders/place?shippingAddress=
GET  /api/orders/my-orders
GET  /api/orders/{id}
```

### Payment (JWT Required)
```
POST /api/payment/create-order
POST /api/payment/verify
```

---

## 💳 Test Payment

Use these Razorpay test credentials:

| Field | Value |
|-------|-------|
| Card Number | 4111 1111 1111 1111 |
| Expiry | Any future date |
| CVV | Any 3 digits |
| OTP | 1234 |

Or use **Netbanking → Test Mode** to simulate payment.

---

## 🚀 Run Locally

### Backend
```bash
# 1. Clone repo
git clone https://github.com/Kiruthika-S-dev/ShopEase.git

# 2. Create PostgreSQL database
createdb shopease_db

# 3. Update application.properties with your DB credentials

# 4. Run Spring Boot
mvn spring-boot:run
```

### Frontend
```
Open frontend/ folder in VS Code
Click Go Live (Live Server extension)
Open: http://127.0.0.1:5500/login.html
```

---

## 🐳 Docker

```bash
docker build -t shopease .
docker run -p 8080:8080 shopease
```

---

## 👩‍💻 Developer

**Kiruthika S** — Ranipet, Tamil Nadu  
📧 kiruthikasaravanan2005@gmail.com  
🔗 [GitHub](https://github.com/Kiruthika-S-dev) | [LinkedIn](https://linkedin.com/in/kiruthika-s05)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
