import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';
import { CartService } from '../../services/cart.service';
import { CartItem, CartProduct } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router)

  readonly isLoading = signal<boolean>(false);
  readonly cartList = signal<CartProduct | null>(null);

  readonly totalCartAmount = computed(() => {
    const cart = this.cartList()
    const items = cart?.items ?? []
    return items.reduce((sum, item) => sum + (item.productPrice || 0) * (item.quantity || 0), 0)
  });

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.cartList.set({
          id: res?.id ?? 0,
          items: Array.isArray(res?.items) ? res.items : [],
          totalAmount: res?.totalAmount ?? 0,
        });
      },
      error: (err) => {
        console.error('Cart load error:', err);
        this.isLoading.set(false);
      },
    });
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    const productId = item.productId;
    if (!productId) return;

    if (newQuantity <= 0) {
      this.removeItem(item);
      return;
    }

    const previousCart = this.cartList();
    const previousQuantity = item.quantity;
    item.quantity = newQuantity;
    this.cartList.set(previousCart ? { ...previousCart } : null);

    this.cartService.updateCart({ productId, quantity: newQuantity }).subscribe({
      next: (res) => {
        if (res && Array.isArray(res.items)) {
          const previousOrder = new Map(
            (previousCart?.items ?? []).map((cartItem, index) => [
              cartItem.productId ?? cartItem.id,
              index,
            ])
          );
          const orderedItems = [...res.items];
          orderedItems.sort((item1, item2) => {
          const item1Id = item1.productId || item1.id;
          const item2Id = item2.productId || item2.id;

          const item1Order = previousOrder.get(item1Id) ?? Number.MAX_SAFE_INTEGER;
          const item2Order = previousOrder.get(item2Id) ?? Number.MAX_SAFE_INTEGER;
          return item1Order - item2Order;
        });

          this.cartList.set({
            id: res.id ?? 0,
            items: orderedItems,
            totalAmount: res.totalAmount ?? this.totalCartAmount(),
          });
        } else {
          this.loadCart();
        }
      },
      error: (err) => {
        console.error('Failed to update item quantity:', err);
        item.quantity = previousQuantity;
        this.cartList.set(previousCart ? { ...previousCart } : null);
      },
    });
  }

  removeItem(item: CartItem): void {
    const cartItemId = item.id;
    if (!cartItemId) return;

    const currentCart = this.cartList();
    const previousItems = currentCart?.items ? [...currentCart.items] : [];

    if (currentCart?.items) {
      const filtered = currentCart.items.filter((i) => i.id !== cartItemId);
      this.cartList.set({ ...currentCart, items: filtered });
    }

    this.cartService.removeFromCart(cartItemId).subscribe({
      next: (res) => {
        if (res && Array.isArray(res.items)) {
          this.cartList.set({
            id: res.id ?? 0,
            items: res.items,
            totalAmount: res.totalAmount ?? 0,
          });
        } else {
          this.loadCart();
        }
      },
      error: (err) => {
        console.error('Error removing cart item:', err);
        if (currentCart) {
          this.cartList.set({ ...currentCart, items: previousItems });
        }
      },
    });
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout'])
  }
}
