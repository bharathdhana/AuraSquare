import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';
import { OrderService } from '../../services/order.service';
import { HttpClient } from '@angular/common/http';
import { ProductsOrderList } from '../../models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-item',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './order-item.html',
  styleUrl: './order-item.css',
})
export class OrderItemComponent implements OnInit{

  private readonly router = inject(Router)
  private readonly http = inject(HttpClient)
  private readonly orderService = inject(OrderService)

  readonly orders = signal<ProductsOrderList[]>([])

  ngOnInit(): void {
    this.loadOrders()
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders: ProductsOrderList[]) => {
        this.orders.set(orders)
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  startShopping(): void {
    this.router.navigate(['/products']);
  }
}
