import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AddToCartRequest, CartProduct, UpdateCartRequest } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  readonly cartState = signal<CartProduct | null>(null);
  readonly cartItemsCount = computed(() => {
    const items = this.cartState()?.items ?? [];
    return items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  });

  getCart(): Observable<CartProduct> {
    return this.http.get<CartProduct>(this.apiUrl).pipe(
      tap((cart) => this.cartState.set(cart))
    );
  }

  addToCart(request: AddToCartRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/items`, request, { responseType: 'text' as const }).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  updateCart(request: UpdateCartRequest): Observable<CartProduct | null> {
    return this.http.put<CartProduct | null>(`${this.apiUrl}/items`, request).pipe(
      tap((updatedCart) => {
        if (updatedCart) {
          this.cartState.set(updatedCart);
        }
      })
    );
  }

  removeFromCart(productId: number): Observable<CartProduct | null> {
    return this.http.delete<CartProduct | null>(`${this.apiUrl}/items/${productId}`).pipe(
      tap((updatedCart) => {
        if (updatedCart) {
          this.cartState.set(updatedCart);
        }
      })
    );
  }
}
