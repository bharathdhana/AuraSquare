import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getToken() && auth.userRole() === 'ADMIN') return true;
  return router.parseUrl('/auth/login');
};

export const sellerGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getToken() && auth.userRole() === 'SELLER') return true;
  return router.parseUrl('/auth/login');
};

export const userGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getToken() && auth.userRole() === 'USER') return true;
  return router.parseUrl('/auth/login');
};
