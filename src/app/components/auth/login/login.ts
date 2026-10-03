import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly credentials: LoginRequest = {
    email: '',
    password: '',
  };

  readonly errorMessage = signal<string>('');
  readonly loading = signal<boolean>(false);

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage.set('Please complete all fields!');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        if(res.role == 'USER') {
          this.loading.set(false);
          this.router.navigate(['/products']);
        } else if(res.role == 'SELLER') {
          this.loading.set(false)
          this.router.navigate(['/seller/products'])
        } else if(res.role == 'ADMIN'){
          this.loading.set(false);
          this.router.navigate(['/admin']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Incorrect email or password. Try again.'
        );
      },
    });
  }
}
