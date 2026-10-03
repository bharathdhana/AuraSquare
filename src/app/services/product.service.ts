import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/product`;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  createProduct(product: Product): Observable<string> {
    return this.http.post(this.apiUrl, product, { responseType: 'text' as const });
  }

  updateProduct(id: number, product: Product): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, product, { responseType: 'text' as const });
  }

  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' as const });
  }
}
