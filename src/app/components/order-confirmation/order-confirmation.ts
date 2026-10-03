import { Component, inject, signal } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  imports: [NavbarComponent],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css',
})
export class OrderConfirmationComponent {
  private readonly router = inject(Router);

  readonly email = signal<string>('');
  readonly paymentId = signal<string>('');
  readonly order = signal<any>(null);

  constructor() {
    const nav = this.router.getCurrentNavigation();
    const state = (nav?.extras.state || history.state) as {
      order?: any;
      paymentId?: any;
      email?: string;
    };

    if (state) {
      if (state.email) this.email.set(state.email);
      if (state.paymentId) this.paymentId.set(state.paymentId);
      if (state.order) this.order.set(state.order);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
