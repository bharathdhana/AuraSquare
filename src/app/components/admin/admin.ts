import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { RegisterComponent } from '../auth/register/register';

@Component({
  selector: 'app-admin',
  imports: [NavbarComponent, RegisterComponent, NgClass],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  readonly activeTab = signal<string>('sellers');
  readonly errorMessage = signal<string>('');
  readonly successMessage = signal<string>('');

  readonly allUsers = signal<User[]>([]);
  readonly users = signal<User[]>([]);
  readonly sellers = signal<User[]>([]);

  private readonly userService = inject(UserService);

  setTab(tabName: string): void {
    this.activeTab.set(tabName);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        const list = users || [];
        this.allUsers.set(list);
        this.users.set(list.filter((u) => u.role === 'USER'));
        this.sellers.set(list.filter((u) => u.role === 'SELLER'));
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message || 'Failed to fetch users. Please try again.'
        );
      },
    });
  }

  onDeleteUser(id?: number): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this user?')) {
      this.errorMessage.set('');
      this.successMessage.set('');
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.successMessage.set('User deleted successfully');
          this.loadUsers();
        },
        error: (err) => {
          this.errorMessage.set(
            err.error?.message || (typeof err.error === 'string' ? err.error : 'Failed to delete user')
          );
        },
      });
    }
  }
}
