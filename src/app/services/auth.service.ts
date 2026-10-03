import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  readonly currentUser = signal<User | null>(null);
  readonly userRole = signal<string>('USER');

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.userRole.set(response.role);
        this.loadUserFromToken();
      })
    );
  }

  register(credentials: RegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, credentials, {
      responseType: 'text' as const,
    });
  }

  logout(): void {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    this.currentUser.set(null);
    this.userRole.set('USER');
  }

  setToken(token: string): void {
    document.cookie = `auth_token=${token}; path=/; SameSite=Strict`;
  }

  getToken(): string | null {
    return (
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1] ?? null
    );
  }

  loadUserFromToken(): void {
    const token = this.getToken();
    if (!token) {
      this.currentUser.set(null);
      return;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return;

      const payload = JSON.parse(atob(payloadBase64));
      const user: User = {
        id: payload.id || payload.userId,
        email: payload.email || payload.sub || '',
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        role: this.userRole(),
      };
      this.currentUser.set(user);
    } catch (error) {
      console.error('Failed to parse auth token:', error);
      this.logout();
    }
  }
}
