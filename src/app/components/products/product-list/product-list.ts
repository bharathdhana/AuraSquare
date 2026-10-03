import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { Product, ToastNotification } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly cdr = inject(ChangeDetectorRef)

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly addingProductId = signal<number | null>(null);
  readonly toasts = signal<ToastNotification[]>([]);
  private toastCounter = 0;

  ngOnInit(): void {
    this.loadProducts();
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe({
      error: (err) => console.error('Wishlist preload error:', err),
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
        this.cdr.detectChanges()
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message ||
            err.message ||
            'Unable to load products right now. Please try again later.'
        );
      },
    });
  }

  addToCart(productId: number): void {
    if (this.addingProductId() !== null) return;

    const product = this.products().find((p) => p.id === productId);
    const title = product ? `${product.title} ${product.model || ''}`.trim() : 'Item';

    this.addingProductId.set(productId);

    this.cartService.addToCart({ productId, quantity: 1 }).subscribe({
      next: () => {
        this.addingProductId.set(null);
        this.showToast('success', 'Added to Cart!', `${title} has been added to your cart.`);
      },
      error: (err) => {
        this.addingProductId.set(null);
        const errMsg =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message || err.message || 'Unable to add this product to your cart.';
        this.showToast('error', 'Failed to Add', errMsg);
      },
    });
  }

  toggleWishlist(productId: number): void {
    const product = this.products().find((p) => p.id === productId);
    const title = product ? `${product.title} ${product.model || ''}`.trim() : 'Item';

    if (this.isInWishlist(productId)) {
      const wishlistItem = this.wishlistService.getWishlistItem(productId);
      if (wishlistItem && wishlistItem.id) {
        this.wishlistService.removeFromWishlist(wishlistItem.id).subscribe({
          next: () => {
            this.showToast('success', 'Wishlist Updated', `${title} removed from your wishlist.`);
          },
          error: (err) => {
            console.error('Wishlist removal error:', err);
            this.showToast('error', 'Wishlist Error', 'Unable to remove item from wishlist.');
          },
        });
      }
    } else {
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => {
          this.showToast('success', 'Wishlist Updated', `${title} saved to your wishlist!`);
        },
        error: (err) => {
          console.error('Wishlist addition error:', err);
          const errMsg =
            typeof err.error === 'string'
              ? err.error
              : err.error?.message || 'Item already in wishlist or error occurred.';
          this.showToast('error', 'Wishlist Error', errMsg);
        },
      });
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  showToast(type: 'success' | 'error', title: string, message: string): void {
    const toastId = ++this.toastCounter;
    this.toasts.update((current) => [...current, { id: toastId, type, title, message }]);

    setTimeout(() => {
      this.removeToast(toastId);
    }, 4000);
  }

  removeToast(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
