import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-products',
  imports: [NavbarComponent],
  templateUrl: './seller-products.html',
  styleUrl: './seller-products.css',
})
export class SellerProducts implements OnInit{
  private readonly productService = inject(ProductService)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly router = inject(Router)

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly products = signal<Product[]>([]);

  ngOnInit(): void {
    this.loadProducts()
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
        )
      }
    })
  }

  updateProduct(product: Product): void {
    this.router.navigate(['/seller/add-product'], {
      state: { product }
    });
  }

  removeProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products.update((list) => list.filter((p) => p.id !== id));
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage.set(
            err.error?.message || (typeof err.error === 'string' ? err.error : null) || err.message || 'Unable to delete product.'
          );
        }
      });
    }
  }

  createNewProduct(): void {
    this.router.navigate(['/seller/add-product']);
  }
}
