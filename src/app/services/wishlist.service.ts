import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap, catchError, of } from 'rxjs';
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
    const rawItems = state?.wishlistItems || state?.items || [];
    if (!Array.isArray(rawItems)) return [];

    return rawItems.filter((item) => {
      if (!item) return false;
      const p = item.product ?? item;
      return !!(p.id || item.id || item.productId || p.title);
    });
  });

  readonly wishlistCount = computed(() => this.wishlistItems().length);

  getWishlist(): Observable<Wishlist> {
    return this.http.get<Wishlist>(this.apiUrl).pipe(
      tap((res) => this.wishlistState.set(res)),
      catchError((err) => {
        console.error('Error fetching wishlist:', err);
        return of({ wishlistItems: [] } as Wishlist);
      })
    );
  }

  addToWishlist(productId: number): Observable<Wishlist> {
    return this.http.post(`${this.apiUrl}/item`, { productId }, { responseType: 'text' as const }).pipe(
      switchMap(() => this.getWishlist()),
      catchError((err) => {
        console.error('Error adding item to wishlist:', err);
        throw err;
      })
    );
  }

  removeFromWishlist(itemId: number): Observable<Wishlist> {
    return this.http.delete<Wishlist>(`${this.apiUrl}/${itemId}`).pipe(
      tap((updatedWishlist) => {
        if (updatedWishlist) {
          this.wishlistState.set(updatedWishlist);
        }
      }),
      catchError((err) => {
        console.error('Error removing item from wishlist:', err);
        const current = this.wishlistState();
        if (current) {
          const items = (current.wishlistItems || current.items || []).filter((i) => i.id !== itemId);
          this.wishlistState.set({ ...current, wishlistItems: items, items });
        }
        throw err;
      })
    );
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems().some(
      (item) => (item.product?.id ?? item.productId ?? item.id) === productId
    );
  }

  getWishlistItem(productId: number): WishlistItem | null {
    return (
      this.wishlistItems().find(
        (item) => (item.product?.id ?? item.productId ?? item.id) === productId
      ) ?? null
    );
  }
}

