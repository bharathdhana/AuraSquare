import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  readonly currentUser = this.authService.currentUser;
  readonly userRole = this.authService.userRole;

  readonly cartCount = this.cartService.cartItemsCount;
  readonly wishlistCount = this.wishlistService.wishlistCount;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
