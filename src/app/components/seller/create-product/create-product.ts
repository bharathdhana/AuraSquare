import { Component, inject, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-create-product',
  imports: [NavbarComponent, FormsModule],
  templateUrl: './create-product.html',
  styleUrl: './create-product.css',
})
export class CreateProduct implements OnInit{

  private readonly router = inject(Router)
  private readonly productService = inject(ProductService)

  readonly errorMessage = signal<string>('');
  readonly isEditMode = signal<boolean>(false)
  readonly editProductId = signal<number | null>(null)

  ngOnInit(): void {
    const state = history.state
    const productData = state?.product || null

    if(productData) {
      this.editProductId.set(productData.id)
      this.isEditMode.set(true)
      this.product = {
        title : productData.title || '',
        brand : productData.brand || '',
        model : productData.model || '',
        category : productData.category || '',
        description : productData.description || '',
        price: productData.price || 0,
        stockQuantity : productData.stockQuantity || 0,
        imageUrl : productData.imageUrl || ''
      }
    }
  }

  categories = [
    'Electronics',
    'Fashion',
    'Books',
    'Automotive',
    'Toys & Games',
    'Computers & Accessories',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Sports & Fitness',
    'Grocery'
  ]

  backToProduct() {
    this.router.navigate(['/seller/products'])
  }

  product:any = {
    title: '',
    brand: '',
    model: '',
    category: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    imageUrl: ''
  }

  onCreateProductFormSubmit(): void {
    if(!this.product.title || !this.product.brand || !this.product.model || !this.product.description || !this.product.category) {
      this.errorMessage.set('Please fill in all fields')
      return
    }

    if(this.product.price <= 0 ) {
      this.errorMessage.set('Price must be greater than 0')
      return
    }

    if(this.product.stockQuantity < 0) {
      this.errorMessage.set('Stock Quantity should not be negative')
      return
    }

    if(this.isEditMode()) {
      const productId = this.editProductId();
      if (productId !== null) {
        this.productService.updateProduct(productId, this.product).subscribe({
          next: () => {
            this.router.navigate(['/seller/products']);
          },
          error: (err) => {
            this.errorMessage.set(err.error?.message || err.message ||
              'Unable to update product right now. Please try again later.')
          }
        });
      }
    } else {
      this.productService.createProduct(this.product).subscribe({
      next: () => {
        this.router.navigate(['/seller/products']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || err.message ||
            'Unable to create product right now. Please try again later.')
      }
    })
    }
  }

  
}
