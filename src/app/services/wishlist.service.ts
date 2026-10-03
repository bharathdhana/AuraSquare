import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Wishlist, WishlistItem } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/wishlist`;

  readonly wishlistState = signal<Wishlist | null>(null);

  readonly wishlistItems = computed<WishlistItem[]>(() => {
    const state = this.wishlistState();
    const items = state?.wishlistItems || state?.items || [];
    return Array.isArray(items) ? items : [];
  });

  readonly wishlistCount = computed(() => this.wishlistItems().length);

  getWishlist(): Observable<Wishlist> {
    return this.http.get<Wishlist>(this.apiUrl).pipe(
      tap((res) => this.wishlistState.set(res))
    );
  }

  addToWishlist(productId: number): Observable<Wishlist> {
    return this.http.post(`${this.apiUrl}/item`, { productId }, { responseType: 'text' as const }).pipe(
      switchMap(() => this.getWishlist())
    );
  }

  removeFromWishlist(itemId: number): Observable<Wishlist> {
    return this.http.delete<Wishlist>(`${this.apiUrl}/${itemId}`).pipe(
      tap((updatedWishlist) => this.wishlistState.set(updatedWishlist))
    );
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems().some(
      (item) => (item.product?.id ?? item.productId) === productId
    );
  }

  getWishlistItem(productId: number): WishlistItem | null {
    return (
      this.wishlistItems().find(
        (item) => (item.product?.id ?? item.productId) === productId
      ) ?? null
    );
  }
}
