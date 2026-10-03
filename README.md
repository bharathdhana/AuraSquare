# Estore Frontend

A full-featured e-commerce frontend built with **Angular 21**, **TypeScript**, and **Tailwind CSS**.

---

## 📌 Features

- **Authentication & Security**:
  - JWT token-based authentication.
  - Role-based route protection using functional Angular guards (`authGuard`, `guestGuard`, `adminGuard`, `sellerGuard`, `userGuard`).
  - Auto-fill protection on seller registration forms.

- **Customer Flow (`USER` role)**:
  - Browse and search product catalog.
  - Add items to Cart and Wishlist.
  - Checkout and view Order history.

- **Seller Flow (`SELLER` role)**:
  - View seller product catalog.
  - Add new products using direct image URLs (`imageUrl`).

- **Admin Flow (`ADMIN` role)**:
  - Dashboard to view all users, customers, and sellers.
  - Delete user/seller accounts.
  - Register new seller profiles.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v20+`
- npm `v10+`
- Running backend API (`ecommerce-api` on `http://localhost:8080`)

### Installation & Run

1. Navigate to the project directory:
   ```bash
   cd estore
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start dev server:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Directory Structure

```text
src/app/
├── components/
│   ├── admin/             # Admin dashboard & account management
│   ├── auth/              # Login & Register pages
│   ├── cart/              # Cart management
│   ├── checkout/          # Order checkout page
│   ├── order-confirmation/ # Order confirmation view
│   ├── order-item/        # Customer order history
│   ├── products/          # Product catalog
│   ├── seller/            # Seller product catalog & add-product page
│   ├── shared/            # Dynamic role-based Navigation Bar
│   └── wishlist/          # Customer wishlist
├── guards/                # Route protection (authGuard, roleGuard)
├── models/                # TypeScript interfaces (User, Product, Cart, Order)
├── services/              # API services (AuthService, UserService, ProductService, etc.)
└── app.routes.ts          # Angular application route definitions
```
