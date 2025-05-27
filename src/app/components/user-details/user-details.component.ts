import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Back Button -->
      <button 
        (click)="goBack()"
        class="mb-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-200">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Users
      </button>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p class="font-bold">Error:</p>
        <p>{{ error }}</p>
        <button 
          (click)="loadUser()" 
          class="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Retry
        </button>
      </div>

      <!-- User Details -->
      <div *ngIf="user && !loading && !error" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <h1 class="text-3xl font-bold text-white">{{ user.name }}</h1>
          <p class="text-blue-100 text-lg">{{ '@' + user.username }}</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Contact Information -->
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Contact Information</h2>
              
              <div class="space-y-3">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-gray-700">{{ user.email }}</span>
                </div>

                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span class="text-gray-700">{{ user.phone }}</span>
                </div>

                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                  </svg>
                  <a [href]="'https://' + user.website" target="_blank" class="text-blue-600 hover:text-blue-800">{{ user.website }}</a>
                </div>
              </div>
            </div>

            <!-- Address Information -->
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Address</h2>
              
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <div class="text-gray-700">
                    <p>{{ user.address.street }}, {{ user.address.suite }}</p>
                    <p>{{ user.address.city + ', ' + user.address.zipcode }}</p>
                    <p class="text-sm text-gray-500 mt-1">
                      Coordinates: {{ user.address.geo.lat }}, {{ user.address.geo.lng }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Company Information -->
            <div class="md:col-span-2 space-y-4">
              <h2 class="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Company</h2>
              
              <div class="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ user.company.name }}</h3>
                <p class="text-gray-600 italic mb-2">{{ user.company.catchPhrase }}</p>
                <p class="text-sm text-gray-500">{{ user.company.bs }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserDetailsComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error: string | null = null;
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.loadUser();
      }
    });
  }

  loadUser(): void {
    if (!this.userId) return;
    
    this.loading = true;
    this.error = null;
    
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}