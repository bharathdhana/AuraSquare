import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { WishlistItem } from '../../models/wishlist.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);

  readonly wishListItems = signal<WishlistItem[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly addingProductId = signal<number | null>(null);
  readonly removingItemId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        const items = res?.wishlistItems || res?.items || [];
        const validItems = (Array.isArray(items) ? items : []).filter((item) => {
          if (!item) return false;
          const p = item.product ?? item;
          return !!(p.id || item.id || item.productId || p.title);
        });
        this.wishListItems.set(validItems);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load wishlist:', err);
        this.isLoading.set(false);
        const serverError = err.error?.message || (typeof err.error === 'string' ? err.error : '');
        this.errorMessage.set(
          serverError || 'Unable to load wishlist. Please check backend service connection.'
        );
      },
    });
  }

  getProduct(item: WishlistItem): Partial<Product> & Partial<WishlistItem> {
    if (!item) return {};
    return item.product ?? item;
  }

  moveToCart(item: WishlistItem): void {
    const safeProductId = item.product?.id ?? item.productId ?? item.id;
    const wishlistItemId = item.id;

    if (!safeProductId || this.addingProductId() !== null) return;

    this.addingProductId.set(safeProductId);

    this.cartService.addToCart({ productId: safeProductId, quantity: 1 }).subscribe({
      next: () => {
        this.addingProductId.set(null);
        if (wishlistItemId) {
          this.removeItem(wishlistItemId);
        } else {
          this.loadWishlist();
        }
      },
      error: (err) => {
        this.addingProductId.set(null);
        console.error('Add to cart from wishlist failed:', err);
      },
    });
  }

  removeItem(itemId: number): void {
    if (!itemId || this.removingItemId() !== null) return;

    this.removingItemId.set(itemId);
    const previousItems = this.wishListItems();
    this.wishListItems.set(previousItems.filter((i) => i.id !== itemId));

    this.wishlistService.removeFromWishlist(itemId).subscribe({
      next: (res) => {
        this.removingItemId.set(null);
        const items = res?.wishlistItems || res?.items || [];
        const validItems = (Array.isArray(items) ? items : []).filter((item) => {
          if (!item) return false;
          const p = item.product ?? item;
          return !!(p.id || item.id || item.productId || p.title);
        });
        this.wishListItems.set(validItems);
      },
      error: (err) => {
        this.removingItemId.set(null);
        console.error('Failed to remove item from wishlist:', err);
        // Retain optimistic removal if item was invalid on server
        this.wishListItems.set(previousItems.filter((i) => i.id !== itemId));
      },
    });
  }
}
