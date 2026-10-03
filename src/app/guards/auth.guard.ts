import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getToken()) return true;
  return router.parseUrl('/auth/login');
};

export const guestGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.getToken()) return true;

  const role = auth.userRole();
  if (role === 'ADMIN') return router.parseUrl('/admin');
  if (role === 'SELLER') return router.parseUrl('/seller/products');
  return router.parseUrl('/products');
};
