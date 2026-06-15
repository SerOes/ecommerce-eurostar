# E-Commerce Eurostar REST API

A lightweight, robust, and clean REST API scaffolded with Node.js, Express, and JSON Web Token (JWT) designed for processing secure e-commerce transactions in memory.

---

## Table of Contents

1. [Description](#description)
2. [Project Architecture](#project-architecture)
3. [Installation](#installation)
4. [How to Run](#how-to-run)
5. [Rules](#rules)
6. [Existent Data](#existent-data)
7. [How to Use the REST API](#how-to-use-the-rest-api)
8. [API Documentation (Swagger UI)](#8-api-documentation-swagger-ui)

---

## 1. Description

This Node.js REST API is fully structured with clear separation of concerns (Routes, Middlewares, Controllers, Services, Models) under the `src` directory. To make exploration easy and fast, the entire database and state are run in-memory, requiring no external database installs or configurations.

---

## 2. Project Architecture

The codebase follows professional developer best practices:

```
ecommerce-eurostar/
├── package.json
├── swagger.yaml                  # OpenAPI 3.0 specification file
├── README.md
└── src/
    ├── app.js                    # Entry point of the Express application
    ├── controllers/
    │   ├── authController.js     # Handles requests/responses for auth operations
    │   ├── checkoutController.js # Handles requests/responses for checkout operations
    │   └── systemController.js   # Handles healthcheck diagnostics
    ├── middlewares/
    │   └── authMiddleware.js     # JWT authenticator with Bearer scheme
    ├── models/
    │   ├── productModel.js       # In-memory Product catalog & helpers
    │   └── userModel.js          # In-memory User data & helpers (utilizing bcryptjs)
    ├── routes/
    │   └── routes.js             # Centralized route mapping for the 4 endpoints
    └── services/
        ├── authService.js        # Business logic for user registration & login
        └── checkoutService.js    # Business logic for checkout validation & calculations
```

---

## 3. Installation

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

1. Clone or clone and enter the repository folder:
   ```bash
   cd ecommerce-eurostar
   ```

2. Install all necessary dependencies:
   ```bash
   npm install
   ```

This will automatically install dependencies like `express`, `jsonwebtoken` (JWT), and `bcryptjs` (password hashing), as well as development dependencies like `nodemon` for code auto-reloads.

---

## 4. How to Run

### Development Mode (with Live Reloading)
To run the server with automatic reloads via `nodemon`, execute:
```bash
npm run dev
```

### Production Mode
To run the application inside a direct Node.js runtime process, execute:
```bash
npm start
```

By default, the server will start up on `http://localhost:3000`.

---

## 5. Rules

The REST API implements specific, strict rules for proper functioning:

1. **Endpoint Limitation**: Only exactly 4 endpoints are exposed in this API:
   - `POST /register`: Registers a new customer.
   - `POST /login`: Authenticates the customer and returns a secure JWT Token.
   - `POST /checkout`: Safe, authenticated cart processing.
   - `GET /healthcheck`: Service status check.
2. **Authentication requirement**: The `/checkout` endpoint is secured. Only users sending a valid JWT token matching the header scheme `Authorization: Bearer <your_token>` are allowed to execute a checkout.
3. **Accepted payment methods**: The checkout only accepts **"cash"** or **"credit card"** inside the `paymentMethod` payload field. Any other payment methods will be rejected with a `400 Bad Request`.
4. **Discount Rule**: Paying with **"cash"** provides an immediate **10% discount** off the original total price. Paying with a **"credit card"** does not apply any discounts.

---

## 6. Existent Data

Since the system runs completely in-memory, the API starting state includes the following seeded entities:

### 3 Initial Users
Each password is securely hashed via `bcryptjs` dynamically at application bootstrap:

| Name | Email | Password |
|---|---|---|
| John Doe | `john@example.com` | `password123` |
| Jane Smith | `jane@example.com` | `secure456` |
| Admin User | `admin@example.com` | `admin789` |

### 3 Initial Products

| Product ID | Name | Ticket Price |
|---|---|---|
| `prod-1` | Laptop | \$1000.00 |
| `prod-2` | Smartphone | \$500.00 |
| `prod-3` | Headphones | \$100.00 |

---

## 7. How to Use the REST API

Here are explicit cURL examples and payloads to test all available endpoints.

### 7.1. Healthcheck
- **Path**: `GET /healthcheck`
- **Headers**: none
- **cURL Request**:
  ```bash
  curl -X GET http://localhost:3000/healthcheck
  ```
- **Example Response**:
  ```json
  {
    "status": "UP",
    "uptime": 12.345,
    "timestamp": "2026-06-15T10:00:00.000Z",
    "message": "E-commerce API is healthy."
  }
  ```

---

### 7.2. Register
- **Path**: `POST /register`
- **Request Body (JSON)**:
  ```json
  {
    "email": "customer@example.com",
    "password": "mypassword123",
    "name": "New Customer"
  }
  ```
- **cURL Request**:
  ```bash
  curl -X POST http://localhost:3000/register \
       -H "Content-Type: application/json" \
       -d '{"email": "customer@example.com", "password": "mypassword123", "name": "New Customer"}'
  ```
- **Example Response**:
  ```json
  {
    "message": "User registered successfully.",
    "user": {
      "id": "user-4",
      "email": "customer@example.com",
      "name": "New Customer"
    }
  }
  ```

---

### 7.3. Login
- **Path**: `POST /login`
- **Request Body (JSON)**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **cURL Request**:
  ```bash
  curl -X POST http://localhost:3000/login \
       -H "Content-Type: application/json" \
       -d '{"email": "john@example.com", "password": "password123"}'
  ```
- **Example Response**:
  ```json
  {
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...",
    "user": {
      "id": "user-1",
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
  ```

---

### 7.4. Checkout (Protected)
- **Path**: `POST /checkout`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body with Cash (10% Discount applied)**:
  ```json
  {
    "paymentMethod": "cash",
    "items": [
      { "productId": "prod-1", "quantity": 1 },
      { "productId": "prod-3", "quantity": 2 }
    ]
  }
  ```
- **cURL Request for Cash**:
  ```bash
  curl -X POST http://localhost:3000/checkout \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..." \
       -d '{"paymentMethod": "cash", "items": [{"productId": "prod-1", "quantity": 1}, {"productId": "prod-3", "quantity": 2}]}'
  ```
- **Example Response**:
  ```json
  {
    "status": "success",
    "user": {
      "id": "user-1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "paymentMethod": "cash",
    "items": [
      {
        "productId": "prod-1",
        "name": "Laptop",
        "price": 1000,
        "quantity": 1,
        "total": 1000
      },
      {
        "productId": "prod-3",
        "name": "Headphones",
        "price": 100,
        "quantity": 2,
        "total": 200
      }
    ],
    "originalTotal": 1200,
    "discount": 120,
    "finalTotal": 1080,
    "message": "Checkout successful with a 10% cash discount applied!",
    "timestamp": "2026-06-15T10:15:30.000Z"
  }
  ```

- **Request Body with Credit Card (No Discount)**:
  ```json
  {
    "paymentMethod": "credit card",
    "items": [
      { "productId": "prod-2", "quantity": 2 }
    ]
  }
  ```
- **cURL Request for Credit Card**:
  ```bash
  curl -X POST http://localhost:3000/checkout \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..." \
       -d '{"paymentMethod": "credit card", "items": [{"productId": "prod-2", "quantity": 2}]}'
  ```
- **Example Response**:
  ```json
  {
    "status": "success",
    "user": {
      "id": "user-1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "paymentMethod": "credit card",
    "items": [
      {
        "productId": "prod-2",
        "name": "Smartphone",
        "price": 500,
        "quantity": 2,
        "total": 1000
      }
    ],
    "originalTotal": 1000,
    "discount": 0,
    "finalTotal": 1000,
    "message": "Checkout successful with credit card. No discount applied.",
    "timestamp": "2026-06-15T10:20:00.000Z"
  }
  ```

---

## 8. API Documentation (Swagger UI)

A full interactive documentation is available using the integrated Swagger page. 

- **Docs Page URL**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Specification Format**: OpenAPI 3.0.3 (saved as `swagger.yaml` in the project root)

To view, test, and interact with the endpoints:
1. Start the server (e.g. `npm run dev`).
2. Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your web browser.
3. Use the integrated UI to construct register/login request models and test checking out with cash or credit card.
