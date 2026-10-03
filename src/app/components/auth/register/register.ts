import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Input() embeddedMode = false;

  readonly userData: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER',
  };

  confirmPassword = '';
  readonly errorMessage = signal<string>('');
  readonly successMessage = signal<string>('');
  readonly loading = signal<boolean>(false);

  ngOnInit(): void {
    if (this.embeddedMode) {
      this.userData.role = 'SELLER';
    }
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (
      !this.userData.firstName ||
      !this.userData.lastName ||
      !this.userData.email ||
      !this.userData.password ||
      !this.userData.role
    ) {
      this.errorMessage.set('Please complete all fields');
      return;
    }

    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage.set("Passwords don't match");
      return;
    }

    if (this.userData.password.length < 6) {
      this.errorMessage.set('Password needs at least 6 characters');
      return;
    }

    this.loading.set(true);

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.loading.set(false);
        this.errorMessage.set('');
        if (!this.embeddedMode) {
          this.router.navigate(['/auth/login']);
        } else {
          this.successMessage.set("You're all set! Account created successfully");
          Object.assign(this.userData, {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 'USER',
          });
          this.confirmPassword = '';
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message || "Oops! Sign-up didn't work. Try again."
        );
      },
    });
  }
}
