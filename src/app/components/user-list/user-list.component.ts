import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">User Management</h1>
      
      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p class="font-bold">Error:</p>
        <p>{{ error }}</p>
        <button 
          (click)="loadUsers()" 
          class="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Retry
        </button>
      </div>

      <!-- Desktop Table -->
      <div *ngIf="!loading && !error" class="hidden md:block">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let user of users" class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  <div class="text-sm text-gray-500">{{ user.username }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
                  <a [href]="'https://' + user.website" target="_blank">{{ user.website }}</a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    (click)="viewUser(user.id)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div *ngIf="!loading && !error" class="md:hidden space-y-4">
        <div *ngFor="let user of users" class="bg-white shadow-lg rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ user.name }}</h3>
          <p class="text-sm text-gray-600 mb-1">{{ '@' + user.username }}</p>
          <p class="text-sm text-gray-600 mb-2">{{ user.email }}</p>
          <p class="text-sm text-blue-600 mb-4">
            <a [href]="'https://' + user.website" target="_blank">{{ user.website }}</a>
          </p>
          <button 
            (click)="viewUser(user.id)"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  viewUser(userId: number): void {
    this.router.navigate(['/user', userId]);
  }
}