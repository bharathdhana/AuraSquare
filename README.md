<<<<<<< HEAD
# AuraSquare
=======
# 🛒 Estore Frontend (AuraSquare)
>>>>>>> b7bba1a (resolving wishlist)

A modern, responsive e-commerce web application built with **Angular**, **TypeScript**, and **Tailwind CSS**.

---

## 📸 Application Screens & Key Modules

### 1. User Registration (`/auth/register`)
Allows new users to create an account by filling out their personal details, selecting a role, and setting up secure credentials.

![User Registration](../screenshots/Screenshot%20(81).png)

### 2. User Login (`/auth/login`)
Enables existing users to securely sign in to their AuraSquare account using JWT-based authentication.

![User Login](../screenshots/Screenshot%20(82).png)

### 3. Product Catalog (`/products`)
Displays available store products with images, titles, descriptions, INR pricing, wishlist toggles, and direct add-to-cart controls.

![Product Catalog](../screenshots/Screenshot%20(83).png)

### 4. Shopping Cart (`/cart`)
Provides an interactive cart summary with quantity controls, subtotal calculation, free shipping indication, and checkout action.

![Shopping Cart](../screenshots/Screenshot%20(85).png)

### 5. My Wishlist (`/wishlist`)
Allows customers to save and organize their favorite products for quick access and future purchases.

![My Wishlist](../screenshots/Screenshot%20(84).png)

### 6. Order History (`/order`)
Allows customers to review their past orders, status updates, and purchased item details.

![Order History](../screenshots/Screenshot%20(86).png)

### 7. Seller Product Catalog (`/seller/products`)
Enables sellers to view and manage inventory items specifically listed under their seller profile.

![Seller Product Catalog](../screenshots/Screenshot%20(87).png)

### 8. Add New Product (`/seller/add-product`)
Provides sellers with a form to publish new store items with details, pricing, and image URLs.

![Add New Product](../screenshots/Screenshot%20(88).png)

### 9. Admin Dashboard - Manage Sellers (`/admin`)
Gives administrators full control to manage user accounts, oversee customer/seller activity, and delete/view sellers.

![Admin Dashboard Sellers](../screenshots/Screenshot%20(89).png)

### 10. Admin - Create Seller Account (`/admin`)
Allows administrators to onboard and register new seller accounts directly from the admin interface.

![Admin Create Seller](../screenshots/Screenshot%20(90).png)

---

## 📌 Technical Features & Role-Based Access

- **JWT Authentication & Security**: Secure token storage with route guards (`authGuard`, `guestGuard`, `adminGuard`, `sellerGuard`, `userGuard`).
- **Customer Flow (`USER`)**: Explore products, manage cart & wishlist, checkout orders, and view order history.
- **Seller Flow (`SELLER`)**: View seller inventory and create new product listings.
- **Admin Flow (`ADMIN`)**: User management, seller onboarding, and system administration.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20+`
- **npm**: `v10+`
- **Backend API**: `ecommerce-api` running on `http://localhost:8080`

### Installation & Local Setup

1. **Navigate to project directory**:
   ```bash
   cd estore
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Directory Structure

```text
src/app/
├── components/
│   ├── admin/              # Admin dashboard & account management
│   ├── auth/               # Login & Register pages
│   ├── cart/               # Cart management & summary
│   ├── checkout/           # Checkout & shipping workflow
│   ├── order-confirmation/ # Order confirmation view
│   ├── order-item/         # Customer order history
│   ├── products/           # Product catalog & browsing
│   ├── seller/             # Seller product management
│   ├── shared/             # Dynamic role-based navigation bar
│   └── wishlist/           # Customer wishlist management
├── guards/                 # Route guards for authentication & authorization
├── models/                 # TypeScript interfaces (User, Product, Cart, Order)
├── services/               # API service integration
└── app.routes.ts           # Application route definitions
```
