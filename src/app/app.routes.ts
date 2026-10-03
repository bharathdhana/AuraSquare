import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { ProductListComponent } from './components/products/product-list/product-list';
import { WishlistComponent } from './components/wishlist/wishlist';
import { CartComponent } from './components/cart/cart';
import { CheckoutComponent } from './components/checkout/checkout';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation';
import { OrderItemComponent } from './components/order-item/order-item';
import { SellerProducts } from './components/seller/seller-products/seller-products';
import { CreateProduct } from './components/seller/create-product/create-product';
import { Admin } from './components/admin/admin';

import { authGuard, guestGuard } from './guards/auth.guard';
import { adminGuard, sellerGuard, userGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'auth/register', component: RegisterComponent, canActivate: [guestGuard] },

  { path: 'products', component: ProductListComponent, canActivate: [authGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [authGuard, userGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard, userGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard, userGuard] },
  { path: 'order-confirmation', component: OrderConfirmationComponent, canActivate: [authGuard, userGuard] },
  { path: 'order', component: OrderItemComponent, canActivate: [authGuard, userGuard] },

  { path: 'seller/products', component: SellerProducts, canActivate: [authGuard, sellerGuard] },
  { path: 'seller/add-product', component: CreateProduct, canActivate: [authGuard, sellerGuard] },

  { path: 'admin', component: Admin, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '/auth/login' },
];
